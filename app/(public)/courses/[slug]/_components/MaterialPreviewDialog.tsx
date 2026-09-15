"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  FileText, 
  Calendar,
  Shield,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface Material {
  id: string;
  title: string;
  fileKey: string;
  createdAt: string;
}

interface MaterialPreviewDialogProps {
  material: Material;
}

export function MaterialPreviewDialog({ material }: MaterialPreviewDialogProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const handleViewMaterial = async () => {
    setIsViewerOpen(true);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Disable common shortcuts
    if (
      (e.ctrlKey || e.metaKey) && 
      (e.key === 's' || e.key === 'p' || e.key === 'a' || e.key === 'c')
    ) {
      e.preventDefault();
      toast.error("This action is not allowed");
    }
    
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
      e.key === 'F12' ||
      ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
      ((e.ctrlKey || e.metaKey) && e.key === 'u')
    ) {
      e.preventDefault();
      toast.error("Developer tools are disabled");
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.error("Right-click is disabled");
  };

  return (
    <>
      <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold truncate">
                  {material.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(material.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              Protected
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <Button 
            onClick={handleViewMaterial}
            className="w-full gap-2"
            variant="outline"
          >
            <Eye className="h-4 w-4" />
            View Material
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent 
          className="max-w-6xl h-[90vh] p-0"
          onKeyDown={handleKeyDown}
          onContextMenu={handleContextMenu}
        >
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {material.title}
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                <span>Protected Content</span>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 p-6 pt-0 h-[calc(90vh-120px)]">
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
                </div>
              </div>
            )}
            
            {pdfUrl && !loadingPdf && !pdfError && (
              <iframe
                src={pdfUrl}
                className="w-full h-full rounded-lg border"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
                onContextMenu={handleContextMenu}
                title={`PDF Viewer - ${material.title}`}
                style={{
                  border: '1px solid #e5e7eb',
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
