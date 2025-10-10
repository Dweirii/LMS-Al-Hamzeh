import { DashboardMaterials } from "../_components/DashboardMaterials";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";

type Params = Promise<{ slug: string }>;

export default async function MaterialsPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);

  return (
    <div className="p-6">
      <DashboardMaterials 
        courseId={course.course.id} 
        courseSlug={course.course.slug} 
      />
    </div>
  );
}
