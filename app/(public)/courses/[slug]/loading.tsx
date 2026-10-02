import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseDetailsLoading() {
  return (
    <div className="mt-7 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-12">
        <div className="flex min-w-0 flex-col gap-7">
          <Skeleton className="aspect-video w-full rounded-2xl" />

          <div className="flex flex-col gap-3.5">
            <Skeleton className="h-12 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[20, 24, 20, 28, 32].map((width, index) => (
                <Skeleton
                  key={index}
                  className="h-6 rounded-full"
                  style={{ width: `${width * 4}px` }}
                />
              ))}
            </div>
          </div>

          <Separator />

          <section className="flex flex-col gap-3.5">
            <Skeleton className="h-8 w-60" />
            <div className="space-y-2.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={index === 4 ? "h-4 w-1/2" : "h-4 w-full"}
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-2">
              <Skeleton className="h-8 w-52" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="flex flex-col gap-2.5">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="flex-row items-center gap-4 px-5 py-4 shadow-none">
                  <Skeleton className="size-9 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="size-5" />
                </Card>
              ))}
            </div>
          </section>
        </div>

        <Card className="gap-0 overflow-hidden py-0">
          <div className="flex items-baseline justify-between border-b px-6 py-5">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-9 w-28" />
          </div>
          <CardContent className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-3.5 rounded-xl bg-muted/60 p-[18px]">
              <Skeleton className="h-4 w-32" />
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="size-[34px] shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3.5 w-32" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <Skeleton className="h-4 w-36" />
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton className="h-3.5 w-44" />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
