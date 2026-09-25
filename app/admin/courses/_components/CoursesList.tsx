"use client";

import { useState } from "react";
import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { AdminCourseCard } from "./AdminCourseCard";
import { CoursesFilters } from "./CoursesFilters";
import { EmptyState } from "@/components/general/EmptyState";

interface CoursesListProps {
  courses: AdminCourseType[];
}

export function CoursesList({ courses }: CoursesListProps) {
  const [filteredCourses, setFilteredCourses] = useState<AdminCourseType[]>(courses);

  if (courses.length === 0) {
    return (
      <EmptyState
        title="No courses found"
        description="Create a new course to get started"
        buttonText="Create Course"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <>
      <CoursesFilters 
        courses={courses} 
        onFilteredCourses={setFilteredCourses} 
      />
      
      {filteredCourses.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card/60 py-12 text-center">
          <h3 className="font-serif text-lg font-medium">No courses match your filters</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}
