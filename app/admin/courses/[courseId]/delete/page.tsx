"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import { useTransition } from "react";
import { deleteCourse } from "./actions";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteCourseRoute() {
  const [pending, startTransition] = useTransition();
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  // 2. Define a submit handler.
  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-1 items-center">
      <Card className="mt-16 w-full gap-6 p-8 sm:mt-24">
        <CardHeader className="gap-3 px-0">
          <span className="flex size-[52px] items-center justify-center rounded-full bg-danger-soft text-danger">
            <Trash2 className="size-6" aria-hidden="true" />
          </span>
          <CardTitle className="font-serif text-2xl leading-snug font-medium">
            Are you sure you want to delete this course?
          </CardTitle>
          <CardDescription className="text-[14.5px]">
            This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-end gap-2.5 px-0">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/admin/courses"
          >
            Cancel
          </Link>

          <Button variant="destructive" onClick={onSubmit} disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
