import { Card, CardContent} from "@/components/ui/card";
import { 
  FileText
} from "lucide-react";
import { MaterialCard } from "@/app/admin/materials/_components/MaterialCard";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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


export async function MaterialsList() {
  const { getMaterials } = await import("@/app/data/admin/admin-get-materials");
  const materials = await getMaterials();

  if (materials.length === 0) {
    return (
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="p-4 bg-muted/50 rounded-full mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No materials yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Upload your first course material to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {materials.map((material) => (
        <MaterialCard
          key={material.id}
          material={{
            ...material,
            createdAt: material.createdAt instanceof Date
              ? material.createdAt.toISOString()
              : material.createdAt
          }}
        />
      ))}
    </div>
  );
}


