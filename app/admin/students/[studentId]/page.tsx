import { getStudentDetails } from "../actions";
import { StudentDetailsView } from "./_components/StudentDetailsView";
import { notFound } from "next/navigation";

interface StudentPageProps {
  params: Promise<{ studentId: string }>;
}

export default async function StudentPage({ params }: StudentPageProps) {
  const { studentId } = await params;
  const result = await getStudentDetails(studentId);

  if (result.status === "error" || !result.data) {
    notFound();
  }

  return <StudentDetailsView student={result.data} />;
}
