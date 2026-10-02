import { Skeleton } from "@/components/ui/skeleton";
import { PublicCourseCardSkeleton } from "@/app/(public)/_components/PublicCourseCard";
import { CourseProgressCardSkeleton } from "../_components/CourseProgressCard";

export default function DashboardLoading() {
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <CourseProgressCardSkeleton key={index} />
        ))}
      </div>

      <section className="mt-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-52" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <PublicCourseCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </>
  );
}
