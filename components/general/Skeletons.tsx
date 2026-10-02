import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Loading placeholders shaped like the shared page pieces (PageHeader,
 * StatCard, the admin tables, form cards), so each route's loading.tsx can be
 * assembled from them and match the page it stands in for.
 */

export function PageHeaderSkeleton({
  action = false,
  backButton = false,
}: {
  action?: boolean;
  backButton?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-3.5">
        {backButton && <Skeleton className="size-9 shrink-0 rounded-md" />}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-64 max-w-full" />
          {!backButton && <Skeleton className="h-4 w-80 max-w-full" />}
        </div>
      </div>
      {action && <Skeleton className="h-9 w-36 rounded-md" />}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="size-10 rounded-lg" />
      </div>
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

export function StatCardsSkeleton({
  count = 4,
  className = "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}

/** Search box + filter select + table, as in the admin people tables. */
export function TableSkeleton({
  columns,
  rows = 8,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-9 w-full rounded-md sm:max-w-[420px] sm:flex-1" />
        <Skeleton className="h-9 w-full rounded-md sm:w-[180px]" />
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex gap-6 border-b px-4 py-3">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            className="flex items-center gap-6 border-b px-4 py-3.5 last:border-b-0"
          >
            <div className="flex flex-1 items-center gap-3">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
            {Array.from({ length: columns - 1 }).map((_, col) => (
              <Skeleton key={col} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** A card holding a form: title, description and labelled fields. */
export function FormCardSkeleton({
  fields = 6,
  className,
}: {
  fields?: number;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        ))}
        <Skeleton className="h-32 w-full rounded-md" />
        <Skeleton className="h-9 w-32 rounded-md" />
      </CardContent>
    </Card>
  );
}

/** Stand-in for a PDF while the viewer fetches and renders it. */
export function PdfSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading document"
      className={cn("flex flex-col items-center gap-4 p-6", className)}
    >
      <div className="flex w-full max-w-3xl items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="w-full max-w-3xl space-y-3 rounded-lg border bg-card p-8 shadow-sm">
        <Skeleton className="h-6 w-1/2" />
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn("h-3.5", index % 4 === 3 ? "w-2/3" : "w-full")}
          />
        ))}
        <Skeleton className="mt-4 aspect-[16/7] w-full" />
      </div>
    </div>
  );
}
