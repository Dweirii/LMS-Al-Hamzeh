import { Card, CardContent } from "@/components/ui/card";

export function MaterialsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
              <div className="h-8 w-8 bg-muted rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-20" />
              <div className="h-6 bg-muted rounded w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

