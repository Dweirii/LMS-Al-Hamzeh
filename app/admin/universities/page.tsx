import { getUniversityStats } from "../instructors/actions";
import { UniversitiesStatsCards } from "./_components/UniversitiesStatsCards";

export default async function UniversitiesPage() {
  const result = await getUniversityStats();
  const stats = result.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Universities Overview</h1>
        <p className="text-muted-foreground">
          Track performance and statistics across universities
        </p>
      </div>
      
      <UniversitiesStatsCards stats={stats} />
    </div>
  );
}
