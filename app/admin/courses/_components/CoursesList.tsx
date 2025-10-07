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
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold">No courses match your filters</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
          {filteredCourses.map((course) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}
