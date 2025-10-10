"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CollapsibleContent,
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play, Menu, BookOpen } from "lucide-react";
import { LessonItem } from "./LessonItem";
import { usePathname, useRouter } from "next/navigation";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface iAppProps {
  course: CourseSidebarDataType["course"];
}

export function MobileCourseSidebar({ course }: iAppProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentLessonId = pathname.split("/").pop();
  const [open, setOpen] = useState(false);

  const { completedLessons, totalLessons, progressPercentage } =
    useCourseProgress({ courseData: course });
  
  const handleViewMaterials = () => {
    router.push(`/dashboard/${course.slug}/materials`);
    setOpen(false);
  };

  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between p-3 gap-2">
        {/* Course Title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="size-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-sm leading-tight truncate">
              {course.title}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {completedLessons}/{totalLessons}
              </p>
              <div className="flex-1 max-w-[80px]">
                <Progress value={progressPercentage} className="h-1" />
              </div>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {progressPercentage}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Menu Button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0 relative">
              <Menu className="h-4 w-4" />
              {progressPercentage < 100 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="p-4 pb-3 border-b bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Play className="size-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="text-left text-base truncate">
                      {course.title}
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground">
                      {course.category}
                    </p>
                  </div>
                </div>
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto">
                {/* Progress Section */}
                <div className="p-4 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-muted-foreground">Your Progress</span>
                      <Badge variant={progressPercentage === 100 ? "default" : "secondary"}>
                        {progressPercentage === 100 ? "Complete!" : `${progressPercentage}%`}
                      </Badge>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {completedLessons} of {totalLessons} lessons completed
                      </span>
                      <span className="font-medium text-primary">
                        {totalLessons - completedLessons} remaining
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chapters and Lessons */}
                <div className="py-4 px-4 space-y-3">
                  {course.chapter.map((chapter, index) => (
                    <Collapsible key={chapter.id} defaultOpen={index === 0}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full p-3 h-auto flex items-center gap-2"
                        >
                          <div className="shrink-0">
                            <ChevronDown className="size-4 text-primary" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="font-semibold text-sm truncate text-foreground">
                              {chapter.position}: {chapter.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium truncate">
                              {chapter.lessons.length} lessons
                            </p>
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
                        {chapter.lessons.map((lesson) => (
                          <div key={lesson.id} onClick={() => setOpen(false)}>
                            <LessonItem
                              lesson={lesson}
                              slug={course.slug}
                              isActive={currentLessonId === lesson.id}
                              completed={
                                lesson.lessonProgress.find(
                                  (progress) => progress.lessonId === lesson.id
                                )?.completed || false
                              }
                            />
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-border bg-muted/20">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground mb-3">Quick Access</p>
                  <Button
                    onClick={handleViewMaterials}
                    variant="outline"
                    className="w-full gap-2 h-auto py-2.5 justify-start hover:bg-primary/5"
                  >
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <BookOpen className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm">Course Materials</span>
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
