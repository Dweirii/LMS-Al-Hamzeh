import { FormCardSkeleton, PageHeaderSkeleton } from "@/components/general/Skeletons";

export default function CreateCourseLoading() {
  return (
    <>
      <PageHeaderSkeleton backButton />
      <FormCardSkeleton fields={8} />
    </>
  );
}
