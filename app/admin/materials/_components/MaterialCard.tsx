"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { 
  Eye, 
  Trash, 
  MoreHorizontal,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

export function MaterialCard({ material }: { material: Material }) {
  const [isVisible, setIsVisible] = useState(material.isVisible);
  const router = useRouter();

  const handleToggleVisibility = async () => {
    try {
      const response = await fetch(`/api/materials/${material.id}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isVisible: !isVisible }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visibility");
      }

      setIsVisible(!isVisible);
      toast.success(`Material ${!isVisible ? "shown" : "hidden"}`);
    } catch (error) {
      console.error("Visibility update error:", error);
      toast.error("Failed to update visibility");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this material?")) {
      return;
    }

    try {
      const response = await fetch(`/api/materials/${material.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete material");
      }

      toast.success("Material deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete material");
    }
  };

  return (
    <Card className="rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {material.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {material.course.title}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/admin/materials/${material.id}`)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {new Date(material.createdAt).toLocaleDateString()}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={isVisible ? "default" : "secondary"}>
              {isVisible ? "Visible" : "Hidden"}
            </Badge>
            <Switch
              checked={isVisible}
              onCheckedChange={handleToggleVisibility}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
