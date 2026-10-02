"use client";

import { PdfSkeleton } from "@/components/general/Skeletons";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  X
} from "lucide-react";
import { toast } from "sonner";

// PDF.js touches browser-only globals (DOMMatrix) while its module initialises, so
// a static import crashes this component during server-side rendering even though
// it is a client component. Load it lazily in the browser instead, once.
type PdfJs = typeof import("pdfjs-dist");
let pdfjsPromise: Promise<PdfJs> | null = null;

export function loadPdfJs(): Promise<PdfJs> {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      return lib;
    });
  }
  return pdfjsPromise;
}

interface SecurePDFViewerProps {
  pdfUrl: string;
  title: string;
  className?: string;
  onClose?: () => void;
}

export function SecurePDFViewer({ pdfUrl, title, className = "", onClose }: SecurePDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  // User zoom on top of fitScale, so 100% means "fit to width".
  const [scale, setScale] = useState(1.0);
  const [fitScale, setFitScale] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Load PDF document
  useEffect(() => {
    if (!pdfUrl) return;

    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create a simple loading task with minimal configuration
        const pdfjs = await loadPdfJs();
        const loadingTask = pdfjs.getDocument({
          url: pdfUrl,
          withCredentials: false,
        });

        const pdf = await loadingTask.promise;
        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error loading PDF:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load PDF: ${errorMessage}`);
        toast.error('Failed to load PDF document');
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  // Fit the page to the container width, and refit whenever the container resizes.
  useEffect(() => {
    const container = containerRef.current;
    if (!pdfDocument || !container) return;

    let cancelled = false;
    let pageWidth = 0;
    const fit = () => {
      if (pageWidth > 0) setFitScale(container.clientWidth / pageWidth);
    };
    const observer = new ResizeObserver(fit);

    (async () => {
      const page = await pdfDocument.getPage(currentPage);
      if (cancelled) return;
      pageWidth = page.getViewport({ scale: 1, rotation }).width;
      fit();
      observer.observe(container);
    })();

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [pdfDocument, currentPage, rotation]);

  // Render current page
  useEffect(() => {
    if (!pdfDocument || !canvasRef.current || fitScale === null) return;

    let cancelled = false;
    let renderTask: { cancel: () => void } | null = null;

    const renderPage = async () => {
      try {
        const page = await pdfDocument.getPage(currentPage);
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Calculate viewport
        const viewport = page.getViewport({ 
          scale: scale * fitScale,
          rotation: rotation 
        });

        // Back the canvas with device pixels so text stays sharp on HiDPI screens,
        // while its CSS size stays at the fitted viewport size.
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        // Render page
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
        };

        const task = page.render(renderContext);
        renderTask = task;
        await task.promise;
      } catch (err) {
        // A resize or zoom cancelled this render in favour of a newer one.
        if ((err as { name?: string })?.name === 'RenderingCancelledException') return;
        console.error('Error rendering page:', err);
        toast.error('Failed to render page');
      }
    };

    renderPage();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdfDocument, currentPage, scale, fitScale, rotation]);

  // Security: Block right-click and keyboard shortcuts
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.warning('Right-click is disabled for security');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block common shortcuts
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 's' || e.key === 'p' || e.key === 'a' || e.key === 'c' || e.key === 'u')
      ) {
        e.preventDefault();
        toast.warning('This action is not allowed');
      }
      
      // Block F12 and dev tools
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J'))
      ) {
        e.preventDefault();
        toast.warning('Developer tools are disabled');
      }

      // Handle navigation
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('contextmenu', handleContextMenu);
      container.addEventListener('keydown', handleKeyDown);
      
      return () => {
        container.removeEventListener('contextmenu', handleContextMenu);
        container.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentPage, totalPages]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoading(true);
    
    // Force reload by clearing and resetting PDF document
    setPdfDocument(null);
    setCurrentPage(1);
    setTotalPages(0);
    
    // Trigger useEffect to reload
    setTimeout(() => {
      if (pdfUrl) {
        const loadPDF = async () => {
          try {
            const pdfjs = await loadPdfJs();
            const loadingTask = pdfjs.getDocument({
              url: pdfUrl,
              withCredentials: false,
            });
            const pdf = await loadingTask.promise;
            setPdfDocument(pdf);
            setTotalPages(pdf.numPages);
            setCurrentPage(1);
          } catch (err) {
            console.error('Retry failed:', err);
            setError('Retry failed. Please check your connection.');
          } finally {
            setLoading(false);
          }
        };
        loadPDF();
      }
    }, 100);
  };

  const closeButton = onClose && (
    <Button variant="ghost" size="sm" onClick={onClose} className="h-8 shrink-0" aria-label="Close">
      <X className="h-4 w-4" />
    </Button>
  );

  if (loading) {
    return (
      <Card className={`relative rounded-xl border shadow-sm ${className}`}>
        {closeButton && <div className="absolute right-2 top-2">{closeButton}</div>}
        <PdfSkeleton />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`relative rounded-xl border shadow-sm ${className}`}>
        {closeButton && <div className="absolute right-2 top-2">{closeButton}</div>}
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="mb-2 font-serif text-lg font-medium">Error Loading PDF</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRetry} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry ({retryCount}/3)
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`rounded-xl border shadow-sm gap-0 py-2 ${className}`}>
      <CardContent className="flex min-h-0 flex-1 flex-col px-2 sm:px-3">
        {/* Controls */}
        <div className="flex shrink-0 items-center justify-between gap-1 sm:gap-3 mb-2 p-1 sm:p-1.5 bg-muted/60 rounded-xl">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
              className="h-8"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline ml-1">Prev</span>
            </Button>
            
            <span className="font-mono text-xs sm:text-sm font-medium px-1 sm:px-2">
              {currentPage} / {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage >= totalPages}
              className="h-8"
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="outline" size="sm" onClick={zoomOut} className="h-8">
              <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            <span className="text-xs sm:text-sm font-medium px-1 sm:px-2 sm:min-w-[50px] text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <Button variant="outline" size="sm" onClick={zoomIn} className="h-8">
              <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={rotate} className="h-8">
              <RotateCw className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <span className="hidden sm:inline-flex px-1 text-warning" aria-label="Protected content">
                  <ShieldCheck className="h-4 w-4" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Protected content: right-click, printing and downloading are disabled.
              </TooltipContent>
            </Tooltip>

            {closeButton}
          </div>
        </div>

        {/* PDF Canvas */}
        <div 
          ref={containerRef}
          className="min-h-0 flex-1 border rounded-xl overflow-auto bg-muted/40"
          tabIndex={0}
          aria-label={title}
        >
          <canvas
            ref={canvasRef}
            className="block mx-auto"
            style={{ 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </div>

      </CardContent>
    </Card>
  );
}