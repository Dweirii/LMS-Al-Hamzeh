import { adminGetUsers } from "@/app/data/admin/admin-get-users";
import { UserManagementTable } from "./_components/UserManagementTable";
import { PageHeader } from "@/components/general/PageHeader";

export default async function UserManagementPage() {
  const users = await adminGetUsers();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="User Management"
        description="Manage user accounts, roles, and permissions"
      />

      <UserManagementTable users={users} />
    </div>
  );
}
