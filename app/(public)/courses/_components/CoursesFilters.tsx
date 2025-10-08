"use client";

import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

interface CoursesFiltersProps {
  courses: PublicCourseType[];
  onFilteredCourses: (courses: PublicCourseType[]) => void;
}

export function CoursesFilters({ courses, onFilteredCourses }: CoursesFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("all");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Get unique values for dropdowns
  const instructors = useMemo(() => {
    const instructorSet = new Set<string>();
    courses.forEach(course => {
      if (course.instructor) {
        instructorSet.add(course.instructor.name);
      }
    });
    return Array.from(instructorSet).sort();
  }, [courses]);

  const universities = useMemo(() => {
    const universitySet = new Set<string>();
    courses.forEach(course => {
      universitySet.add(course.university);
    });
    return Array.from(universitySet).sort();
  }, [courses]);

  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    courses.forEach(course => {
      categorySet.add(course.category);
    });
    return Array.from(categorySet).sort();
  }, [courses]);

  const levels = useMemo(() => {
    const levelSet = new Set<string>();
    courses.forEach(course => {
      levelSet.add(course.level);
    });
    return Array.from(levelSet).sort();
  }, [courses]);

  // Filter courses based on all criteria
  useEffect(() => {
    const filtered = courses.filter((course) => {
      // Search filter
      const matchesSearch = 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.smallDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.instructor && course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()));

      // Instructor filter
      const matchesInstructor = 
        selectedInstructor === "all" || 
        (course.instructor && course.instructor.name === selectedInstructor) ||
        (selectedInstructor === "no-instructor" && !course.instructor);

      // University filter
      const matchesUniversity = 
        selectedUniversity === "all" || 
        course.university === selectedUniversity;

      // Category filter
      const matchesCategory = 
        selectedCategory === "all" || 
        course.category === selectedCategory;

      // Level filter
      const matchesLevel = 
        selectedLevel === "all" || 
        course.level === selectedLevel;

      return matchesSearch && matchesInstructor && matchesUniversity && matchesCategory && matchesLevel;
    });

    onFilteredCourses(filtered);
  }, [searchTerm, selectedInstructor, selectedUniversity, selectedCategory, selectedLevel, courses, onFilteredCourses]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedInstructor("all");
    setSelectedUniversity("all");
    setSelectedCategory("all");
    setSelectedLevel("all");
  };

  const hasActiveFilters = searchTerm || selectedInstructor !== "all" || selectedUniversity !== "all" || selectedCategory !== "all" || selectedLevel !== "all";

  return (
    <div className="space-y-4 mb-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search courses, instructors, or descriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Instructor Filter */}
        <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Instructors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Instructors</SelectItem>
            <SelectItem value="no-instructor">No Instructor</SelectItem>
            {instructors.map((instructor) => (
              <SelectItem key={instructor} value={instructor}>
                {instructor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* University Filter */}
        <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Universities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Universities</SelectItem>
            {universities.map((university) => (
              <SelectItem key={university} value={university}>
                {university === "UJ" ? "University of Jordan" : "Petra University"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Level Filter */}
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="size-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: {searchTerm}
              <X 
                className="size-3 cursor-pointer" 
                onClick={() => setSearchTerm("")}
              />
            </Badge>
          )}
          {selectedInstructor !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Instructor: {selectedInstructor === "no-instructor" ? "No Instructor" : selectedInstructor}
              <X 
                className="size-3 cursor-pointer" 
                onClick={() => setSelectedInstructor("all")}
              />
            </Badge>
          )}
          {selectedUniversity !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              University: {selectedUniversity === "UJ" ? "University of Jordan" : "Petra University"}
              <X 
                className="size-3 cursor-pointer" 
                onClick={() => setSelectedUniversity("all")}
              />
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {selectedCategory}
              <X 
                className="size-3 cursor-pointer" 
                onClick={() => setSelectedCategory("all")}
              />
            </Badge>
          )}
          {selectedLevel !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Level: {selectedLevel}
              <X 
                className="size-3 cursor-pointer" 
                onClick={() => setSelectedLevel("all")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
