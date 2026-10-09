"use client";

import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { PublicCourseCard } from "../PublicCourseCard";
import { Reveal } from "./Reveal";

export function PopularCourses({ courses }: { courses: PublicCourseType[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, i) => (
        <Reveal key={course.id} delay={i * 100} className="flex *:w-full">
          <PublicCourseCard data={course} />
        </Reveal>
      ))}
    </div>
  );
}
