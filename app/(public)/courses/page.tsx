import { getAllCourses } from "@/app/data/course/get-all-courses";
import { PublicCourseCardSkeleton } from "../_components/PublicCourseCard";
import { CoursesList } from "./_components/CoursesList";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function PublicCoursesroute() {
  return (
    <div className="mt-12">
      <div className="mb-8 flex flex-col gap-2">
        <p className="eyebrow">Catalog</p>
        <h1 className="font-serif text-4xl font-medium tracking-tight md:text-5xl">
          Explore Courses
        </h1>
        <p className="text-base text-muted-foreground md:text-[17px]">
          Discover our wide range of courses designed to help you achieve your
          learning goals.
        </p>
      </div>

      <Suspense fallback={<LoadingSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

async function RenderCourses() {
  const courses = await getAllCourses();

  return <CoursesList courses={courses} />;
}

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
