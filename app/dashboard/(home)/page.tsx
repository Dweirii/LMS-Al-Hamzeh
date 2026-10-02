import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/general/EmptyState";
import { getAllCourses } from "@/app/data/course/get-all-courses";
import { getEnrolledCourses } from "@/app/data/user/get-enrolled-courses";
import { PublicCourseCard } from "@/app/(public)/_components/PublicCourseCard";

import { CourseProgressCard } from "../_components/CourseProgressCard";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="eyebrow">My learning</p>
          <h1 className="font-serif text-3xl font-medium tracking-tight">
            Enrolled Courses
          </h1>
          <p className="text-[15px] text-muted-foreground">
            Here you can see all the courses you have access to
          </p>
        </div>
        <span className="inline-flex h-7 w-fit items-center gap-1.5 rounded-full bg-secondary px-3 text-xs font-medium text-secondary-foreground">
          <BookOpen className="size-3.5" aria-hidden="true" />
          {enrolledCourses.length}{" "}
          {enrolledCourses.length === 1 ? "course" : "courses"}
        </span>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No courses purchased"
          description="You haven't purchased any courses yet."
          buttonText="Browse Courses"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {enrolledCourses.map((course) => (
            <CourseProgressCard key={course.Course.id} data={course} />
          ))}
        </div>
      )}

      <section className="mt-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-serif text-2xl font-medium tracking-tight">
              Available Courses
            </h2>
            <p className="text-[15px] text-muted-foreground">
              Here you can see all the courses you can purchase
            </p>
          </div>
          <Link
            href="/courses"
            className={buttonVariants({ variant: "outline" })}
          >
            Browse Courses
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>

        {courses.filter(
          (course) =>
            !enrolledCourses.some(
              ({ Course: enrolled }) => enrolled.id === course.id
            )
        ).length === 0 ? (
          <EmptyState
            title="No courses available"
            description="You have already purchased all available courses."
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    ({ Course: enrolled }) => enrolled.id === course.id
                  )
              )
              .map((course) => (
                <PublicCourseCard key={course.id} data={course} />
              ))}
          </div>
        )}
      </section>
    </>
  );
}
