"use client";

import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { PublicCourseCard } from "../../_components/PublicCourseCard";
import { CoursesFilters } from "./CoursesFilters";
import { useState, useEffect } from "react";

interface CoursesListProps {
  courses: PublicCourseType[];
}

export function CoursesList({ courses }: CoursesListProps) {
  const [filteredCourses, setFilteredCourses] = useState<PublicCourseType[]>(courses);

  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  if (filteredCourses.length === 0 && courses.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-semibold">No matching courses found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-semibold">No courses available</h3>
        <p className="text-muted-foreground mt-2">
          Check back later for new courses.
        </p>
      </div>
    );
  }

  return (
    <>
      <CoursesFilters courses={courses} onFilteredCourses={setFilteredCourses} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <PublicCourseCard key={course.id} data={course} />
        ))}
      </div>
    </>
  );
}
