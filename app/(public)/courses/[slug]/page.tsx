import { getIndividualCourse } from "@/app/data/course/get-course";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { UniversityBadge } from "@/components/general/UniversityBadge";
import { env } from "@/lib/env";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconPlayerPlay,
  IconUser,
  IconBuilding,
} from "@tabler/icons-react";
import { CheckIcon, ChevronRight, Lock } from "lucide-react";
import Image from "next/image";
import { checkIfCourseBought } from "@/app/data/user/user-is-enrolled";
import Link from "next/link";
import { EnrollmentButton } from "./_components/EnrollmentButton";
import { buttonVariants } from "@/components/ui/button";

type Params = Promise<{ slug: string }>;

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getIndividualCourse(slug);
  const isEnrolled = await checkIfCourseBought(course.id);

  const totalLessons =
    course.chapter.reduce(
      (total, chapter) => total + chapter.lessons.length,
      0
    ) || 0;

  const whatYouGet = [
    { icon: IconClock, label: "Course Duration", value: `${course.duration} hours` },
    { icon: IconChartBar, label: "Difficulty Level", value: course.level },
    { icon: IconCategory, label: "Category", value: course.category },
    { icon: IconBook, label: "Total Lessons", value: `${totalLessons} Lessons` },
    ...(course.instructor
      ? [{ icon: IconUser, label: "Instructor", value: course.instructor.name }]
      : []),
    {
      icon: IconBuilding,
      label: "University",
      value:
        course.university === "UJ" ? "University of Jordan" : "Petra University",
    },
  ];

  return (
    <div className="mt-7 flex flex-col gap-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-[13.5px] text-muted-foreground"
      >
        <Link href="/courses" className="hover:text-foreground">
          Courses
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="truncate text-foreground">{course.title}</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-12">
        <div className="order-1 flex min-w-0 flex-col gap-7">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-thumb-1 shadow-sm">
            <Image
              src={`https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${course.fileKey}`}
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-3.5">
            <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl">
              {course.title}
            </h1>
            <p className="line-clamp-2 text-lg leading-relaxed text-muted-foreground">
              {course.smallDescription}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <Badge className="h-6 gap-1.5 border-transparent bg-brand-soft px-2.5 text-primary">
                <IconChartBar className="size-3.5" />
                <span>{course.level}</span>
              </Badge>
              <Badge className="h-6 gap-1.5 border-transparent bg-brand-soft px-2.5 text-primary">
                <IconCategory className="size-3.5" />
                <span>{course.category}</span>
              </Badge>
              <Badge className="h-6 gap-1.5 border-transparent bg-brand-soft px-2.5 text-primary">
                <IconClock className="size-3.5" />
                <span>{course.duration} hours</span>
              </Badge>
              {course.instructor && (
                <Badge className="h-6 gap-1.5 border-transparent bg-secondary px-2.5 text-secondary-foreground">
                  <IconUser className="size-3.5" />
                  <span>{course.instructor.name}</span>
                </Badge>
              )}
              <UniversityBadge university={course.university} long />
            </div>
          </div>

          <Separator />

          <section className="flex flex-col gap-3.5">
            <h2 className="font-serif text-3xl font-medium tracking-tight">
              Course Description
            </h2>

            <div className="text-[15.5px] leading-relaxed text-muted-foreground">
              <RenderDescription json={course.description} />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-serif text-3xl font-medium tracking-tight">
                Course Content
              </h2>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">{course.chapter.length}</strong>{" "}
                chapters ·{" "}
                <strong className="text-foreground">{totalLessons}</strong> Lessons
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {course.chapter.map((chapter, index) => (
                <Collapsible key={chapter.id} defaultOpen={index === 0}>
                  <Card className="gap-0 overflow-hidden p-0 shadow-none">
                    <CollapsibleTrigger className="group/chapter w-full text-left">
                      <div className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft font-mono text-sm text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold">
                            {chapter.title}
                          </h3>
                          <p className="text-[13px] text-muted-foreground">
                            {chapter.lessons.length} lesson
                            {chapter.lessons.length !== 1 ? "s" : ""}
                          </p>
                        </div>

                        <Badge variant="outline" className="hidden sm:inline-flex">
                          {chapter.lessons.length} lesson
                          {chapter.lessons.length !== 1 ? "s" : ""}
                        </Badge>
                        <IconChevronDown className="size-5 text-muted-foreground transition-transform group-data-[state=open]/chapter:rotate-180" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <ul className="flex flex-col gap-0.5 border-t bg-muted/40 px-3 py-2 sm:pl-16">
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <li
                            key={lesson.id}
                            className="flex items-center gap-3.5 rounded-lg px-3 py-2.5"
                          >
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border-[1.5px] border-input text-muted-foreground">
                              <IconPlayerPlay className="size-3" />
                            </span>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">{lesson.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Lesson {lessonIndex + 1}
                              </p>
                            </div>
                            {!isEnrolled && (
                              <Lock
                                className="size-4 text-muted-foreground"
                                aria-label="Locked"
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </section>
        </div>

        {/* Enrollment Card */}
        <div className="order-2">
          <div className="sticky top-24">
            <Card id="enrollment" className="gap-0 overflow-hidden py-0">
              <div className="flex items-baseline justify-between border-b px-6 py-5">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-serif text-4xl text-foreground">
                  {course.price === 0
                    ? "Free"
                    : new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(course.price)}
                </span>
              </div>

              <CardContent className="flex flex-col gap-5 p-6">
                <div className="flex flex-col gap-3.5 rounded-xl bg-muted/60 p-[18px]">
                  <h4 className="text-sm font-semibold">What you will get</h4>
                  {whatYouGet.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-brand-soft text-primary">
                        <item.icon className="size-4" />
                      </span>
                      <div>
                        <p className="text-[12.5px] text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2.5">
                  <h4 className="text-sm font-semibold">This course includes</h4>
                  <ul className="flex flex-col gap-2.5">
                    {[
                      "Full lifetime access",
                      "Access on mobile and desktop",
                      "Certificate of completion",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-sm">
                        <span className="flex size-5 items-center justify-center rounded-full bg-success-soft text-success">
                          <CheckIcon className="size-3" strokeWidth={2.5} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isEnrolled ? (
                  <Link
                    className={buttonVariants({ size: "lg", className: "w-full" })}
                    href="/dashboard"
                  >
                    Watch Course
                  </Link>
                ) : (
                  <EnrollmentButton courseId={course.id} />
                )}

                <p className="-mt-2 text-center text-[12.5px] text-muted-foreground">
                  30-day money-back guarantee
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
