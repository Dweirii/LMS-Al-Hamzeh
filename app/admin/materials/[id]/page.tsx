import { MaterialDetails } from "./_components/MaterialDetails";

interface MaterialPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MaterialPage({ params }: MaterialPageProps) {
  const { id } = await params;
  
  return <MaterialDetails materialId={id} />;
}

