import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditLessonLoading() {
  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <Skeleton className="h-9 w-28 rounded-md" />
      <Card>
        <CardHeader className="gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-40 w-full rounded-md" />
          </div>
          {/* Thumbnail and video uploaders */}
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="h-9 w-32 rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}
