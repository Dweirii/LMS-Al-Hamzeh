"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  FileText,
  AlertTriangle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

// PDF.js touches browser-only globals (DOMMatrix) while its module initialises, so
// a static import crashes this component during server-side rendering even though
// it is a client component. Load it lazily in the browser instead, once.
type PdfJs = typeof import("pdfjs-dist");
let pdfjsPromise: Promise<PdfJs> | null = null;

function loadPdfJs(): Promise<PdfJs> {
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
}

export function SecurePDFViewer({ pdfUrl, title, className = "" }: SecurePDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
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

  // Render current page
  useEffect(() => {
    if (!pdfDocument || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDocument.getPage(currentPage);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Calculate viewport
        const viewport = page.getViewport({ 
          scale: scale, 
          rotation: rotation 
        });

        // Set canvas dimensions
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render page
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error('Error rendering page:', err);
        toast.error('Failed to render page');
      }
    };

    renderPage();
  }, [pdfDocument, currentPage, scale, rotation]);

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

  if (loading) {
    return (
      <Card className={`rounded-2xl border-0 shadow-sm ${className}`}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading PDF...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`rounded-2xl border-0 shadow-sm ${className}`}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading PDF</h3>
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
    <Card className={`rounded-2xl border-0 shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </CardHeader>
      
      <CardContent>
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 p-2 sm:p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center">
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
            
            <span className="text-xs sm:text-sm font-medium px-1 sm:px-2">
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

          <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center">
            <Button variant="outline" size="sm" onClick={zoomOut} className="h-8">
              <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            <span className="text-xs sm:text-sm font-medium px-1 sm:px-2 min-w-[50px] text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <Button variant="outline" size="sm" onClick={zoomIn} className="h-8">
              <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={rotate} className="h-8">
              <RotateCw className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* PDF Canvas */}
        <div 
          ref={containerRef}
          className="border rounded-lg overflow-auto bg-white"
          style={{ maxHeight: '70vh' }}
          tabIndex={0}
        >
          <canvas
            ref={canvasRef}
            className="block mx-auto"
            style={{ 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              margin: '20px auto'
            }}
          />
        </div>

        {/* Security Warning */}
        <div className="mt-3 md:mt-4 p-2 md:p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 text-xs md:text-sm text-amber-800 dark:text-amber-200">
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
            <span className="font-medium">Protected Content</span>
          </div>
          <p className="text-xs md:text-sm text-amber-700 dark:text-amber-300 mt-1">
            This PDF is protected. Right-click, printing, and downloading are disabled.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}