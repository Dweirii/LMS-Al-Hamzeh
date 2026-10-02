import { Skeleton } from "@/components/ui/skeleton";
import { MaterialsSkeleton } from "./_components/MaterialsSkeleton";

export default function MaterialsLoading() {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3.5">
          <Skeleton className="size-12 shrink-0 rounded-xl" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
        </div>
        <Skeleton className="h-9 w-40 rounded-md" />
      </div>
      <MaterialsSkeleton />
    </>
  );
}
