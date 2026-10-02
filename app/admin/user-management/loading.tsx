import { PageHeaderSkeleton, TableSkeleton } from "@/components/general/Skeletons";

export default function UserManagementLoading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <TableSkeleton columns={8} />
    </div>
  );
}
