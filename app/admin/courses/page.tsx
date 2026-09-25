import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  AdminCourseCardSkeleton,
} from "./_components/AdminCourseCard";
import { Suspense } from "react";
import { CoursesList } from "./_components/CoursesList";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/general/PageHeader";

export default function CoursesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Courses"
        title="Your Courses"
        description="Create, edit and publish courses for both universities."
        actions={
          <Link className={buttonVariants()} href="/admin/courses/create">
            <Plus aria-hidden="true" />
            Create Course
          </Link>
        }
      />

      <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </>
  );
}

async function RenderCourses() {
  const data = await adminGetCourses();

  return <CoursesList courses={data} />;
}

function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
