import { Suspense } from "react";
import { MaterialDetails } from "./_components/MaterialDetails";
import { MaterialSkeleton } from "./_components/MaterialDetails";

interface MaterialPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MaterialPage({ params }: MaterialPageProps) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<MaterialSkeleton />}>
      <MaterialDetails materialId={id} />
    </Suspense>
  );
}

