"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { AdminCourseType } from "@/app/data/admin/admin-get-courses";

interface CoursesFiltersProps {
  courses: AdminCourseType[];
  onFilteredCourses: (courses: AdminCourseType[]) => void;
}

type InstructorFilter = "all" | string;
type UniversityFilter = "all" | "UJ" | "PETRA";
type StatusFilter = "all" | "Draft" | "Published" | "Archived";

export function CoursesFilters({ courses, onFilteredCourses }: CoursesFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [instructorFilter, setInstructorFilter] = useState<InstructorFilter>("all");
  const [universityFilter, setUniversityFilter] = useState<UniversityFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Get unique instructors for filter dropdown
  const instructors = useMemo(() => {
    const instructorMap = new Map();
    courses.forEach(course => {
      if (course.instructor) {
        instructorMap.set(course.instructor.id, {
          id: course.instructor.id,
          name: course.instructor.name
        });
      }
    });
    return Array.from(instructorMap.values());
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.smallDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesInstructor = 
        instructorFilter === "all" ||
        (course.instructor && course.instructor.id === instructorFilter) ||
        (!course.instructor && instructorFilter === "unassigned");
      
      const matchesUniversity = 
        universityFilter === "all" ||
        course.university === universityFilter;
      
      const matchesStatus = 
        statusFilter === "all" ||
        course.status === statusFilter;
      
      return matchesSearch && matchesInstructor && matchesUniversity && matchesStatus;
    });
  }, [courses, searchTerm, instructorFilter, universityFilter, statusFilter]);

  // Update parent component when filtered courses change
  useMemo(() => {
    onFilteredCourses(filteredCourses);
  }, [filteredCourses, onFilteredCourses]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search courses by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={instructorFilter} onValueChange={(value: InstructorFilter) => setInstructorFilter(value)}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Filter by instructor" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Instructors</SelectItem>
          <SelectItem value="unassigned">Unassigned</SelectItem>
          {instructors.map((instructor) => (
            <SelectItem key={instructor.id} value={instructor.id}>
              {instructor.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={universityFilter} onValueChange={(value: UniversityFilter) => setUniversityFilter(value)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by university" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Universities</SelectItem>
          <SelectItem value="UJ">University of Jordan</SelectItem>
          <SelectItem value="PETRA">Petra University</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Draft">Draft</SelectItem>
          <SelectItem value="Published">Published</SelectItem>
          <SelectItem value="Archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
