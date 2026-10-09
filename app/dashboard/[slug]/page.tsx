import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";

interface iAppProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseSlugRoute({ params }: iAppProps) {
  const { slug } = await params;

  const course = await getCourseSidebarData(slug);

  // A course can have no chapters yet, or chapters with no lessons: take the
  // first lesson in the course, wherever it is.
  const firstLesson = course.course.chapter.find(
    (chapter) => chapter.lessons.length > 0
  )?.lessons[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }
  return (
    <div className="flex items-center justify-center h-full text-center">
      <h2 className="mb-2 font-serif text-2xl font-medium">No lessons available</h2>
      <p className="text-muted-foreground">
        This course does not have any lessons yet!
      </p>
    </div>
  );
}
