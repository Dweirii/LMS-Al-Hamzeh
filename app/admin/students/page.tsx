import { getStudents, getStudentsStats } from "./actions";
import { StudentsTable } from "./_components/StudentsTable";
import { StudentsStatsCards } from "./_components/StudentsStatsCards";
import { PageHeader } from "@/components/general/PageHeader";

export default async function StudentsPage() {
  const [studentsResult, statsResult] = await Promise.all([
    getStudents(),
    getStudentsStats()
  ]);

  const students = studentsResult.data || [];
  const stats = statsResult.data || {
    totalStudents: 0,
    activeStudents: 0,
    bannedStudents: 0,
    averageCompletionRate: 0
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="Students Management"
        description="Manage and monitor student progress across all courses"
      />
      
      <StudentsStatsCards stats={stats} />
      <StudentsTable students={students} />
    </div>
  );
}
