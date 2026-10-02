import { PageHeaderSkeleton, TableSkeleton } from "@/components/general/Skeletons";

export default function InstructorsLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <TableSkeleton columns={5} />
    </div>
  );
}
