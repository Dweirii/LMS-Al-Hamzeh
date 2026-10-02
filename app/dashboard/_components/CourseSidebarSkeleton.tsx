import { Skeleton } from "@/components/ui/skeleton";

export function CourseSidebarSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-3.5 border-b border-border p-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-[42px] shrink-0 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2 p-2.5">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-4 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            {/* The first chapter starts open, so show a few lessons under it. */}
            {index === 0 && (
              <div className="ml-[18px] space-y-2 border-l-[1.5px] py-1 pl-2.5">
                {Array.from({ length: 3 }).map((_, lesson) => (
                  <Skeleton key={lesson} className="h-9 w-full rounded-lg" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MobileCourseSidebarSkeleton() {
  return (
    <div className="sticky top-(--header-height) z-20 border-b border-border bg-background">
      <div className="flex items-center justify-between gap-2 p-3">
        <Skeleton className="size-8 shrink-0 rounded-md" />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Skeleton className="size-8 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-2.5 w-2/5" />
          </div>
        </div>
        <Skeleton className="size-8 shrink-0 rounded-md" />
      </div>
    </div>
  );
}
