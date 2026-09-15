"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Calendar,
  Shield,
  AlertTriangle,
  BookOpen,
  X,
  Maximize2
} from "lucide-react";
import { toast } from "sonner";
import { SecurePDFViewer } from "@/components/ui/SecurePDFViewer";

interface Material {
  id: string;
  title: string;
  fileKey: string;
  createdAt: string;
}

interface DashboardMaterialsProps {
  courseId: string;
  courseSlug: string;
}

export function DashboardMaterials({ courseId }: DashboardMaterialsProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingMaterial, setViewingMaterial] = useState<Material | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const fetchMaterials = useCallback(async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/materials`);
      if (response.ok) {
        const data = await response.json();
        setMaterials(data);
      }
    } catch (error) {
      console.error("Failed to fetch materials:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const handleViewMaterial = async (material: Material) => {
    setViewingMaterial(material);
    setLoadingPdf(true);
    setPdfError(false);
    setPdfUrl(null);

    try {
      const response = await fetch(`/api/materials/${material.id}/view`);
      if (!response.ok) {
        throw new Error("Failed to get PDF URL");
      }
      
      const data = await response.json();
      setPdfUrl(data.url);
    } catch (error) {
      console.error("Failed to load PDF:", error);
      setPdfError(true);
      toast.error("Failed to load material");
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleCloseViewer = useCallback(() => {
    setViewingMaterial(null);
    setPdfUrl(null);
    setLoadingPdf(false);
    setPdfError(false);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      (e.ctrlKey || e.metaKey) && 
      (e.key === 's' || e.key === 'p' || e.key === 'a' || e.key === 'c')
    ) {
      e.preventDefault();
      toast.error("This action is not allowed");
    }
    
    if (
      e.key === 'F12' ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
      ((e.ctrlKey || e.metaKey) && e.key === 'u')
    ) {
      e.preventDefault();
      toast.error("Developer tools are disabled");
    }

    if (e.key === 'Escape') {
      handleCloseViewer();
    }
  }, [handleCloseViewer]);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    toast.error("Right-click is disabled");
  }, []);

  useEffect(() => {
    if (viewingMaterial) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [viewingMaterial, handleKeyDown, handleContextMenu]);

  if (loading) {
    return (
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl animate-pulse">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="h-6 w-48 bg-muted rounded animate-pulse" />
              <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (materials.length === 0) {
    return (
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Course Materials</CardTitle>
              <p className="text-muted-foreground">
                Access course materials and resources
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No materials available</h3>
            <p className="text-muted-foreground text-center">
              Course materials will appear here when they are added by the instructor.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (viewingMaterial) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 md:p-4 border-b bg-background">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <FileText className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-sm md:text-base truncate">{viewingMaterial.title}</h2>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="text-xs">Protected Content</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseViewer}
              className="gap-1 md:gap-2 shrink-0"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Close</span>
            </Button>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 bg-muted/30">
            {loadingPdf && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-4"></div>
                  <p className="text-sm text-muted-foreground">Loading material...</p>
                </div>
              </div>
            )}
            
            {pdfError && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">File not available</h3>
                  <p className="text-sm text-muted-foreground">
                    Unable to load the material. Please try again.
                  </p>
                  <Button
                    onClick={() => handleViewMaterial(viewingMaterial)}
                    variant="outline"
                    className="mt-4"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}
            
            {pdfUrl && !loadingPdf && !pdfError && (
              <SecurePDFViewer 
                pdfUrl={pdfUrl} 
                title={viewingMaterial.title}
                className="h-full border-0"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Course Materials</CardTitle>
            <p className="text-muted-foreground">
              Access course materials and resources
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {materials.map((material) => (
            <Card key={material.id} className="rounded-xl border shadow-sm hover:shadow-md transition-shadow min-w-0">
              <CardHeader className="pb-3 p-3 md:p-4">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-2 min-w-0">
                  <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0 w-full sm:w-auto">
                    <div className="p-1.5 md:p-2 bg-primary/10 rounded-lg shrink-0">
                      <FileText className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm md:text-base truncate">{material.title}</h3>
                      <div className="flex items-center gap-1 md:gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">
                          {new Date(material.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="gap-1 text-xs shrink-0 self-start sm:self-auto">
                    <Shield className="h-3 w-3" />
                    <span className="hidden sm:inline">Protected</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 p-3 md:p-4 md:pt-0">
                <Button 
                  onClick={() => handleViewMaterial(material)}
                  className="w-full gap-1 md:gap-2 text-sm"
                  size="sm"
                >
                  <Maximize2 className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="sm:hidden">View</span>
                  <span className="hidden sm:inline">View Full Screen</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Separator />
        
        <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-amber-800 dark:text-amber-200">
              Protected Content
            </p>
            <p className="text-xs md:text-sm text-amber-700 dark:text-amber-300">
              These materials are protected and cannot be downloaded or shared.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
