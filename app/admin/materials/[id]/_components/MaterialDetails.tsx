"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  BookOpen, 
  FileText
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { SecurePDFViewer } from "@/components/ui/SecurePDFViewer";

interface Material {
  id: string;
  title: string;
  fileKey: string;
  isVisible: boolean;
  createdAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
  };
}

interface MaterialDetailsProps {
  materialId: string;
}

export function MaterialDetails({ materialId }: MaterialDetailsProps) {
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMaterial() {
      try {
        const response = await fetch(`/api/materials/${materialId}`);
        if (response.ok) {
          const data = await response.json();
          setMaterial({
            ...data,
            createdAt: data.createdAt instanceof Date 
              ? data.createdAt.toISOString() 
              : data.createdAt
          });
          
          // Fetch PDF URL for viewer
          const viewResponse = await fetch(`/api/materials/${materialId}/view`);
          if (viewResponse.ok) {
            const viewData = await viewResponse.json();
            setPdfUrl(viewData.url);
          }
        } else if (response.status === 404) {
          setMaterial(null);
        }
      } catch (error) {
        console.error("Failed to fetch material:", error);
        setMaterial(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMaterial();
  }, [materialId]);

  if (loading) {
    return <MaterialSkeleton />;
  }

  if (!material) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/materials">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Materials
          </Link>
        </Button>
      </div>

      {/* Material Info Card */}
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {material.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {material.course.title}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant={material.isVisible ? "default" : "secondary"}>
              {material.isVisible ? "Visible" : "Hidden"}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Uploaded on {new Date(material.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>File: {material.fileKey}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="text-sm text-muted-foreground">
                Material is protected and can only be viewed through the secure preview below.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secure PDF Viewer */}
      {pdfUrl ? (
        <SecurePDFViewer 
          pdfUrl={pdfUrl} 
          title={material.title}
          className="w-full"
        />
      ) : (
        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Loading PDF...</h3>
              <p className="text-muted-foreground">
                Preparing secure PDF viewer...
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function MaterialSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-24 bg-muted rounded" />
      </div>

      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-xl" />
              <div>
                <div className="h-6 bg-muted rounded w-48 mb-2" />
                <div className="h-4 bg-muted rounded w-32" />
              </div>
            </div>
            <div className="h-6 w-16 bg-muted rounded" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-40" />
              <div className="h-4 bg-muted rounded w-32" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="h-10 bg-muted rounded" />
              <div className="h-10 bg-muted rounded" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-32" />
        </CardHeader>
        <CardContent>
          <div className="aspect-[4/3] bg-muted/50 rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}