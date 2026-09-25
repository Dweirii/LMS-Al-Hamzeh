import { getInstructors } from "./actions";
import { InstructorsTable } from "./_components/InstructorsTable";
import { PageHeader } from "@/components/general/PageHeader";

export default async function InstructorsPage() {
  const result = await getInstructors();
  const instructors = result.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="Instructors Management"
        description="Manage instructors and their course assignments"
      />
      
      <InstructorsTable instructors={instructors} />
    </div>
  );
}
