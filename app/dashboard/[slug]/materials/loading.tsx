import { MaterialsSkeleton } from "@/app/admin/materials/_components/MaterialsSkeleton";

export default function MaterialsLoading() {
  return (
    <div className="p-4 sm:p-6 lg:px-9 lg:py-7">
      <MaterialsSkeleton />
    </div>
  );
}
