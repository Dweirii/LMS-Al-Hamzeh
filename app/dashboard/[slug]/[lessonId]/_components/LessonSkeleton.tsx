import { Skeleton } from "@/components/ui/skeleton";

export function LessonSkeleton() {
  return (
    <div className="flex h-full flex-col gap-6 p-4 sm:p-6 lg:px-9 lg:py-7">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-5/24" />
        </div>
      </div>
    </div>
  );
}
