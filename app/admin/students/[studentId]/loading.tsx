import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCardsSkeleton } from "@/components/general/Skeletons";

export default function StudentDetailsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-36 rounded-md" />

      <Card className="flex-row flex-wrap items-center gap-5 px-6">
        <Skeleton className="size-16 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
      </Card>

      <StatCardsSkeleton />

      <Card>
        <CardHeader className="gap-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </CardHeader>
        <CardContent className="space-y-2.5">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
            >
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-5 w-56" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-3.5 w-80 max-w-full" />
                <Skeleton className="h-1.5 w-full" />
              </div>
              <Skeleton className="h-8 w-32 rounded-md sm:ml-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
