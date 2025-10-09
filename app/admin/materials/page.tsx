import { Suspense } from "react";
import { MaterialsList } from "./_components/MaterialsList";
import { MaterialsHeader } from "./_components/MaterialsHeader";
import { MaterialsSkeleton } from "./_components/MaterialsSkeleton";
import { getCourses } from "@/app/data/admin/admin-get-materials";

export default async function MaterialsPage() {
  const courses = await getCourses();

  return (
    <>
      <MaterialsHeader courses={courses} />
      
      <Suspense fallback={<MaterialsSkeleton />}>
        <MaterialsList />
      </Suspense>
    </>
  );
}
