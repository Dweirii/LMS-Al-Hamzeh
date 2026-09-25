import { getUniversityStats } from "../instructors/actions";
import { UniversitiesStatsCards } from "./_components/UniversitiesStatsCards";
import { PageHeader } from "@/components/general/PageHeader";

export default async function UniversitiesPage() {
  const result = await getUniversityStats();
  const stats = result.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Organisation"
        title="Universities Overview"
        description="Track performance and statistics across universities"
      />
      
      <UniversitiesStatsCards stats={stats} />
    </div>
  );
}
