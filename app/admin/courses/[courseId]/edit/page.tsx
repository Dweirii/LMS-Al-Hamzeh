import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditCourseForm } from "./_components/EditCourseForm";
import { CourseStructure } from "./_components/CourseStructure";
import { getInstructors } from "../../create/actions";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

type Params = Promise<{ courseId: string }>;

export default async function EditRoute({ params }: { params: Params }) {
  const { courseId } = await params;
  const [data, instructorsResult] = await Promise.all([
    adminGetCourse(courseId),
    getInstructors()
  ]);
  const instructors = instructorsResult.data || [];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3.5">
        <Link
          href="/admin/courses"
          aria-label="Back to courses"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <p className="eyebrow">Edit Course</p>
          <h1 className="font-serif text-3xl font-medium tracking-tight">
            {data.title}
          </h1>
        </div>
        <Link
          href={`/courses/${data.slug}`}
          className={buttonVariants({ variant: "outline", className: "sm:ml-auto" })}
        >
          <Eye className="size-4" />
          Preview
        </Link>
      </div>

      <Tabs defaultValue="basic-info" className="w-full gap-5">
        <TabsList className="h-11 p-1">
          <TabsTrigger value="basic-info" className="px-4">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure" className="px-4">Course Structure</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl font-medium">Basic Info</CardTitle>
              <CardDescription>
                Provide basic information about the course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditCourseForm data={data} instructors={instructors} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-xl font-medium">Course Structure</CardTitle>
              <CardDescription>
                Here you can update your Course Structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStructure data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
