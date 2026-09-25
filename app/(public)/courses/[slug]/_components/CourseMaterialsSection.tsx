import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Lock, 
  AlertTriangle,
  FileText
} from "lucide-react";
import { getMaterialsByCourseId } from "@/app/data/admin/admin-get-materials";
import { MaterialPreviewDialog } from "./MaterialPreviewDialog";
import Link from "next/link";

interface CourseMaterialsSectionProps {
  courseId: string;
  isEnrolled: boolean;
}

export async function CourseMaterialsSection({ 
  courseId, 
  isEnrolled 
}: CourseMaterialsSectionProps) {
  const materials = await getMaterialsByCourseId(courseId);

  if (!isEnrolled) {
    return (
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted/50 rounded-xl">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="font-serif text-2xl font-medium">Course Materials</CardTitle>
              <p className="text-muted-foreground">
                Access course materials and resources
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Materials are locked</p>
              <p className="text-sm text-muted-foreground">
                You must enroll in this course to access the materials.
              </p>
            </div>
          </div>
          
          <Button asChild className="w-full">
            <Link href="#enrollment">
              Enroll Now to Access Materials
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (materials.length === 0) {
    return (
      <Card className="rounded-xl border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-soft rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-serif text-2xl font-medium">Course Materials</CardTitle>
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
            <h3 className="mb-2 font-serif text-lg font-medium">No materials available</h3>
            <p className="text-muted-foreground text-center">
              Course materials will appear here when they are added by the instructor.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-soft rounded-lg">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-serif text-2xl font-medium">Course Materials</CardTitle>
            <p className="text-muted-foreground">
              Access course materials and resources
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((material) => (
            <MaterialPreviewDialog
              key={material.id}
              material={{
                ...material,
                createdAt: material.createdAt.toString(),
              }}
            />
          ))}
        </div>
        
        <Separator />
        
        <div className="flex items-start gap-3 p-4 bg-warning-soft rounded-xl border border-transparent">
          <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning">
              Protected Content
            </p>
            <p className="text-sm text-warning">
              These materials are protected and cannot be downloaded or shared.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
