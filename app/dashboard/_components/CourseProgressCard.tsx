/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import { useConstructUrl } from "@/hooks/use-construct-url";
import { useCourseProgress } from "@/hooks/use-course-progress";

import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: EnrolledCourseType;
}

export function CourseProgressCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.Course.fileKey);
  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({ courseData: data.Course as any });
  return (
    <Card className="group relative flex-col gap-0 overflow-hidden py-0 sm:flex-row">
      <div className="relative shrink-0 sm:w-[220px]">
        <Badge className="absolute top-3 left-3 z-10 border-transparent bg-foreground text-background">
          {data.Course.level}
        </Badge>
        <Image
          width={600}
          height={400}
          className="aspect-video h-full w-full bg-thumb-1 object-cover sm:aspect-auto"
          src={thumbnailUrl}
          alt="Thumbail Image of Course"
        />
      </div>

      <CardContent className="flex min-w-0 flex-1 flex-col gap-2.5 p-5">
        <Link
          className="line-clamp-2 font-serif text-xl leading-snug font-medium transition-colors hover:underline group-hover:text-primary"
          href={`/dashboard/${data.Course.slug}`}
        >
          {data.Course.title}
        </Link>
        <p className="line-clamp-2 text-[13.5px] leading-relaxed text-muted-foreground">
          {data.Course.smallDescription}
        </p>

        <div className="mt-1 flex flex-col gap-1.5">
          <div className="flex justify-between text-[13px]">
            <p className="text-muted-foreground">Progress</p>
            <p className="font-mono font-medium">{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>

        <Link
          href={`/dashboard/${data.Course.slug}`}
          className={buttonVariants({ className: "mt-1.5 w-fit" })}
        >
          <Play aria-hidden="true" />
          Continue learning
        </Link>
      </CardContent>
    </Card>
  );
}

export function CourseProgressCardSkeleton() {
  return (
    <Card className="flex-col gap-0 overflow-hidden py-0 sm:flex-row">
      <Skeleton className="aspect-video w-full shrink-0 rounded-none sm:aspect-auto sm:w-[220px]" />
      <CardContent className="flex min-w-0 flex-1 flex-col gap-2.5 p-5">
        <Skeleton className="h-6 w-4/5" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-2/3" />
        </div>
        <div className="mt-1 flex flex-col gap-1.5">
          <div className="flex justify-between">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3.5 w-10" />
          </div>
          <Skeleton className="h-1.5 w-full" />
          <Skeleton className="h-3 w-36" />
        </div>
        <Skeleton className="mt-1.5 h-9 w-40 rounded-md" />
      </CardContent>
    </Card>
  );
}
