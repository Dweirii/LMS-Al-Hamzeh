import { ReactNode, Suspense } from "react";
import { CourseSidebar } from "../_components/CourseSidebar";
import { MobileCourseSidebar } from "../_components/MobileCourseSidebar";
import {
  CourseSidebarSkeleton,
  MobileCourseSidebarSkeleton,
} from "../_components/CourseSidebarSkeleton";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";

interface iAppProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

// The sidebars stream in behind skeletons rather than holding up the whole
// course shell. Access is still enforced per page: every page under [slug]
// calls getCourseSidebarData or getLessonContent, which check enrollment.
export default function CourseLayout({ children, params }: iAppProps) {
  return (
    <div className="-mx-4 -my-6 flex min-h-[calc(100svh-var(--header-height))] flex-1 flex-col md:-my-7 lg:-mx-9 lg:-my-8 lg:flex-row">
      {/* Mobile Sidebar - Hidden on desktop */}
      <div className="lg:hidden">
        <Suspense fallback={<MobileCourseSidebarSkeleton />}>
          <CourseSidebarLoader params={params} mobile />
        </Suspense>
      </div>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden w-[340px] shrink-0 border-r border-border bg-card lg:sticky lg:top-(--header-height) lg:block lg:h-[calc(100svh-var(--header-height))] lg:self-start">
        <Suspense fallback={<CourseSidebarSkeleton />}>
          <CourseSidebarLoader params={params} />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

async function CourseSidebarLoader({
  params,
  mobile = false,
}: {
  params: Promise<{ slug: string }>;
  mobile?: boolean;
}) {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);

  return mobile ? (
    <MobileCourseSidebar course={course.course} />
  ) : (
    <CourseSidebar course={course.course} />
  );
}
