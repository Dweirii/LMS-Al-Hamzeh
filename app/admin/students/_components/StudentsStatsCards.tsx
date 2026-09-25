import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { StudentsStats } from "../actions";
import { StatCard } from "@/components/general/StatCard";

interface StudentsStatsCardsProps {
  stats: StudentsStats;
}

export function StudentsStatsCards({ stats }: StudentsStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Students"
        value={stats.totalStudents}
        description="Students with enrollments"
        icon={<Users />}
      />
      <StatCard
        title="Active Students"
        value={stats.activeStudents}
        description="Not banned students"
        icon={<UserCheck />}
        tone="success"
        colorValue
      />
      <StatCard
        title="Banned Students"
        value={stats.bannedStudents}
        description="Banned from platform"
        icon={<UserX />}
        tone="danger"
        colorValue
      />
      <StatCard
        title="Avg. Completion"
        value={`${stats.averageCompletionRate}%`}
        description="Global completion rate"
        icon={<TrendingUp />}
        tone="petra"
        colorValue
      />
    </div>
  );
}
