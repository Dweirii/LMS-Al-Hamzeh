import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeaderSkeleton, StatCardsSkeleton } from "@/components/general/Skeletons";
import { AdminCourseCardSkeleton } from "./courses/_components/AdminCourseCard";

export default function AdminDashboardLoading() {
  return (
    <>
      <PageHeaderSkeleton action />

      <StatCardsSkeleton className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4" />

      <Card>
        <CardHeader className="gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <AdminCourseCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </>
  );
}
