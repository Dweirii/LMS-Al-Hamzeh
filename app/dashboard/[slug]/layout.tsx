import { ReactNode } from "react";
import { CourseSidebar } from "../_components/CourseSidebar";
import { MobileCourseSidebar } from "../_components/MobileCourseSidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";

interface iAppProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

export default async function CourseLayout({ children, params }: iAppProps) {
  const { slug } = await params;

  // Server-side security check and lightweight data fetching
  const course = await getCourseSidebarData(slug);

  return (
    <div className="-mx-4 -my-6 flex min-h-[calc(100svh-var(--header-height))] flex-1 flex-col md:-my-7 lg:-mx-9 lg:-my-8 lg:flex-row">
      {/* Mobile Sidebar - Hidden on desktop */}
      <div className="lg:hidden">
        <MobileCourseSidebar course={course.course} />
      </div>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden w-[340px] shrink-0 border-r border-border bg-card lg:block">
        <CourseSidebar course={course.course} />
      </div>

      {/* Main Content */}
      <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
