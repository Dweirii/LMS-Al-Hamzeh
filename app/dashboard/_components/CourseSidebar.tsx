"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import {
  CollapsibleContent,
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play, BookOpen } from "lucide-react";
import { LessonItem } from "./LessonItem";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCourseProgress } from "@/hooks/use-course-progress";

interface iAppProps {
  course: CourseSidebarDataType["course"];
}

export function CourseSidebar({ course }: iAppProps) {
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop();

  const { completedLessons, totalLessons, progressPercentage } =
    useCourseProgress({ courseData: course });

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-3.5 border-b border-border p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-[42px] shrink-0 items-center justify-center rounded-lg bg-brand-soft">
            <Play className="size-[18px] text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-lg leading-tight">
              {course.title}
            </h1>
            <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
              {course.category}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[12.5px]">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {progressPercentage}% complete
          </p>
        </div>
      </div>

      <nav
        aria-label="Course content"
        className="flex flex-1 flex-col gap-1 overflow-y-auto p-3"
      >
        {course.chapter.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="group/chapter flex h-auto w-full items-center gap-2.5 p-2.5 data-[state=open]:bg-muted"
              >
                <ChevronDown className="size-4 shrink-0 -rotate-90 text-muted-foreground transition-transform group-data-[state=open]/chapter:rotate-0" />
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-[13.5px] font-semibold text-foreground">
                    {chapter.position}: {chapter.title}
                  </p>
                  <p className="truncate text-[11.5px] font-normal text-muted-foreground">
                    {chapter.lessons.length} lessons
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 mb-1.5 ml-[18px] space-y-0.5 border-l-[1.5px] pl-2.5">
              {chapter.lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  slug={course.slug}
                  isActive={currentLessonId === lesson.id}
                  completed={
                    lesson.lessonProgress.find(
                      (progress) => progress.lessonId === lesson.id
                    )?.completed || false
                  }
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </nav>

      {/* Materials Section */}
      <div className="mt-auto border-t border-border p-3.5">
        <Button asChild variant="outline" className="w-full gap-2">
          <Link href={`/dashboard/${course.slug}/materials`}>
            <BookOpen className="h-4 w-4" />
            <span>Course Materials</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
