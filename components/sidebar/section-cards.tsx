import {
  IconBook,
  IconPlaylistX,
  IconShoppingCart,
  IconUsers,
} from "@tabler/icons-react";
import { adminGetDashboardStats } from "@/app/data/admin/admin-get-dashboard-stats";
import { StatCard } from "@/components/general/StatCard";

export async function SectionCards() {
  const { totalCourses, totalCustomers, totalLessons, totalSignups } =
    await adminGetDashboardStats();

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <StatCard
        title="Total Signups"
        value={totalSignups}
        description="Registered users on the platform"
        icon={<IconUsers />}
      />
      <StatCard
        title="Total Customers"
        value={totalCustomers}
        description="Users who have enrolled in courses"
        icon={<IconShoppingCart />}
      />
      <StatCard
        title="Total Courses"
        value={totalCourses}
        description="Available courses on the platform"
        icon={<IconBook />}
      />
      <StatCard
        title="Total Lessons"
        value={totalLessons}
        description="Total learning content available"
        icon={<IconPlaylistX />}
      />
    </div>
  );
}
