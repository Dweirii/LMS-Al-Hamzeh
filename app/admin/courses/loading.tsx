import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton } from "@/components/general/Skeletons";
import { AdminCourseCardSkeleton } from "./_components/AdminCourseCard";

export default function AdminCoursesLoading() {
  return (
    <>
      <PageHeaderSkeleton action />
      <div>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Skeleton className="h-9 w-full rounded-md sm:max-w-[420px] sm:flex-1" />
          <Skeleton className="h-9 w-full rounded-md sm:w-[200px]" />
          <Skeleton className="h-9 w-full rounded-md sm:w-[190px]" />
          <Skeleton className="h-9 w-full rounded-md sm:w-[160px]" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <AdminCourseCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  );
}
