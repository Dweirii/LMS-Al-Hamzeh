import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UniversityBadge } from "@/components/general/UniversityBadge";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { ArrowRight, Clock, GraduationCap, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: PublicCourseType;
}

export function PublicCourseCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.fileKey);
  return (
    <Card className="group relative gap-0 overflow-hidden py-0">
      <div className="relative">
        <Badge className="absolute top-3 left-3 z-10 border-transparent bg-foreground text-background">
          {data.level}
        </Badge>

        <Image
          width={600}
          height={400}
          className="aspect-video h-full w-full bg-thumb-1 object-cover"
          src={thumbnailUrl}
          alt="Thumbail Image of Course"
        />
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-[18px]">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-[13px] text-muted-foreground">
            <Tag className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{data.category}</span>
          </span>
          <UniversityBadge university={data.university} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Link
            className="line-clamp-2 font-serif text-xl leading-snug font-medium transition-colors hover:underline group-hover:text-primary"
            href={`/courses/${data.slug}`}
          >
            {data.title}
          </Link>
          <p className="line-clamp-2 text-[13.5px] leading-relaxed text-muted-foreground">
            {data.smallDescription}
          </p>
        </div>

        {/* Course Details: duration and instructor */}
        <div className="mt-auto flex items-center gap-4 border-t pt-3 text-[13px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {data.duration}h
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5">
            <GraduationCap className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {data.instructor ? data.instructor.name : "No Instructor"}
            </span>
          </span>
        </div>

        <Link
          href={`/courses/${data.slug}`}
          className={buttonVariants({ className: "w-full" })}
        >
          Learn More
          <ArrowRight aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative gap-0 overflow-hidden py-0">
      <div className="absolute top-3 left-3 z-10 flex items-center">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="relative h-fit w-full">
        <Skeleton className="aspect-video w-full rounded-none" />
      </div>

      <CardContent className="flex flex-col gap-3 p-[18px]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        <div className="flex items-center gap-x-5 border-t pt-3">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-24" />
        </div>

        <Skeleton className="h-10 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
