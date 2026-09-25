import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import {
  ArrowRight,
  BarChart3,
  Clock,
  Eye,
  MoreVertical,
  Pencil,
  Trash2,
  GraduationCap,
} from "lucide-react";
import { StatusBadge } from "@/components/general/StatusBadge";
import { UniversityBadge } from "@/components/general/UniversityBadge";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: AdminCourseType;
}

export function AdminCourseCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.fileKey);
  return (
    <Card className="group relative gap-0 overflow-hidden py-0">
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <StatusBadge status={data.status} className="bg-card/95" />
        </div>
        {/* absolute dropdrown */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                aria-label="Course actions"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/admin/courses/${data.id}/edit`}>
                  <Pencil className="size-4 mr-2" />
                  Edit Course
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/courses/${data.slug}`}>
                  <Eye className="size-4 mr-2" />
                  Preview
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/admin/courses/${data.id}/delete`}>
                  <Trash2 className="size-4 mr-2 text-destructive" />
                  Delete Course
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Image
          src={thumbnailUrl}
          alt="Thumbnail Url"
          width={600}
          height={400}
          className="aspect-video h-full w-full bg-thumb-1 object-cover"
        />
      </div>

      <CardContent className="flex flex-1 flex-col gap-3 p-[18px]">
        <div className="flex flex-col gap-1.5">
          <Link
            href={`/admin/courses/${data.id}/edit`}
            className="line-clamp-2 font-serif text-xl leading-snug font-medium transition-colors hover:underline group-hover:text-primary"
          >
            {data.title}
          </Link>

          <p className="line-clamp-2 text-[13.5px] leading-relaxed text-muted-foreground">
            {data.smallDescription}
          </p>
        </div>

        {/* Instructor and University Info */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-[13px] text-muted-foreground">
            <GraduationCap className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {data.instructor ? data.instructor.name : "Unassigned"}
            </span>
          </span>
          <UniversityBadge university={data.university} />
        </div>

        {/* Course Details */}
        <div className="mt-auto flex items-center gap-4 border-t pt-3 text-[13px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {data.duration}h
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BarChart3 className="size-3.5" aria-hidden="true" />
            {data.level}
          </span>
        </div>

        <Link
          className={buttonVariants({
            variant: "outline",
            className: "w-full",
          })}
          href={`/admin/courses/${data.id}/edit`}
        >
          Edit Course <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function AdminCourseCardSkeleton() {
  return (
    <Card className="group relative gap-0 overflow-hidden py-0">
      <div className="absolute top-3 right-3 left-3 z-10 flex items-center justify-between">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
      <div className="relative h-fit w-full">
        <Skeleton className="aspect-video w-full rounded-none" />
      </div>
      <CardContent className="flex flex-col gap-3 p-[18px]">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="flex items-center gap-x-5 border-t pt-3">
          <Skeleton className="h-4 w-10 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
