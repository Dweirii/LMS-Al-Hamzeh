import { getInstructors } from "./actions";
import { InstructorsTable } from "./_components/InstructorsTable";

export default async function InstructorsPage() {
  const result = await getInstructors();
  const instructors = result.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Instructors Management</h1>
        <p className="text-muted-foreground">
          Manage instructors and their course assignments
        </p>
      </div>
      
      <InstructorsTable instructors={instructors} />
    </div>
  );
}
