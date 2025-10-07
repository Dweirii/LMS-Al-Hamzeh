import { getStudents, getStudentsStats } from "./actions";
import { StudentsTable } from "./_components/StudentsTable";
import { StudentsStatsCards } from "./_components/StudentsStatsCards";

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
      <div>
        <h1 className="text-3xl font-bold">Students Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor student progress across all courses
        </p>
      </div>
      
      <StudentsStatsCards stats={stats} />
      <StudentsTable students={students} />
    </div>
  );
}
