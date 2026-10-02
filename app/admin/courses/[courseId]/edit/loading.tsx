import { Skeleton } from "@/components/ui/skeleton";
import { FormCardSkeleton } from "@/components/general/Skeletons";

export default function EditCourseLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3.5">
        <Skeleton className="size-9 rounded-md" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md sm:ml-auto" />
      </div>

      <div className="flex flex-col gap-5">
        <Skeleton className="h-11 w-80 max-w-full rounded-lg" />
        <FormCardSkeleton fields={8} />
      </div>
    </div>
  );
}
