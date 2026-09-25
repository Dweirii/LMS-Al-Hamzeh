import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getInstructors } from "./actions";
import { CourseCreationForm } from "./_components/CourseCreationForm";

export default async function CourseCreationPage() {
  const instructorsResult = await getInstructors();
  const instructors = instructorsResult.data || [];

  return (
    <>
      <div className="flex items-center gap-3.5">
        <Link
          href="/admin/courses"
          aria-label="Back to courses"
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <p className="eyebrow">Courses</p>
          <h1 className="font-serif text-3xl font-medium tracking-tight">
            Create Course
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl font-medium">
            Basic Information
          </CardTitle>
          <CardDescription>
            Provide basic information about the course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseCreationForm instructors={instructors} />
        </CardContent>
      </Card>
    </>
  );
}
