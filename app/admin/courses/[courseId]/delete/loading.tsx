import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DeleteCourseLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-1 items-center">
      <Card className="mt-16 w-full gap-6 p-8 sm:mt-24">
        <div className="space-y-3">
          <Skeleton className="size-[52px] rounded-full" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex justify-end gap-2.5">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </Card>
    </div>
  );
}
