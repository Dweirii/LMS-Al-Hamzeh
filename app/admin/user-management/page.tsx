import { adminGetUsers } from "@/app/data/admin/admin-get-users";
import { UserManagementTable } from "./_components/UserManagementTable";

export default async function UserManagementPage() {
  const users = await adminGetUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts, roles, and permissions
        </p>
      </div>

      <UserManagementTable users={users} />
    </div>
  );
}
