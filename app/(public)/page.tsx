import { buttonVariants } from "@/components/ui/button";
import { UniversityBadge } from "@/components/general/UniversityBadge";
import { getAllCourses } from "@/app/data/course/get-all-courses";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  FileText,
  GraduationCap,
  Library,
  Play,
  PlayCircle,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react";

import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AnimatedCounter } from "./_components/landing/AnimatedCounter";
import { Reveal } from "./_components/landing/Reveal";
import { PopularCourses } from "./_components/landing/PopularCourses";

/* ------------------------------------------------------------------ */
/* Content — edit the numbers here as they grow                        */
/* ------------------------------------------------------------------ */

interface Achievement {
  value: number;
  suffix?: string;
  label: string;
  icon: LucideIcon;
}

const achievements: Achievement[] = [
  { value: 284, label: "Students enrolled", icon: Users },
  { value: 2, label: "Universities — UJ & PETRA", icon: Building2 },
  { value: 70, suffix: "+", label: "Expert instructors", icon: GraduationCap },
  { value: 100, suffix: "+", label: "University courses", icon: Library },
  { value: 50, suffix: "+", label: "PDFs, summaries & past exams", icon: FileText },
];

const STUDENT_COUNT = achievements[0].value;

interface Service {
  title: string;
  description: string;
  points: string[];
  icon: LucideIcon;
}

const services: Service[] = [
  {
    title: "Courses that follow your syllabus",
    description:
      "Short video lessons organised chapter by chapter, exactly in the order your university teaches them.",
    points: ["Watch at your own pace", "Rewatch any lesson before the exam"],
    icon: PlayCircle,
  },
  {
    title: "Learn from the best instructors",
    description:
      "Experienced instructors who know the course, the exam style and where students usually get stuck.",
    points: ["Worked exam problems", "Clear, step-by-step explanations"],
    icon: GraduationCap,
  },
  {
    title: "A library of materials",
    description:
      "Summaries, worksheets and past exams for every course, opened in a secure viewer right next to your lessons.",
    points: ["Track your progress per lesson", "Study on phone, tablet or laptop"],
    icon: FileText,
  },
];

interface Testimonial {
  name: string;
  major: string;
  university: "UJ" | "PETRA";
  result: string;
  quote: string;
}

/**
 * Add real student quotes here (with their permission) and the
 * "Success stories" section appears automatically. Left empty on purpose
 * so the live site never shows placeholder reviews.
 */
const testimonials: Testimonial[] = [];

const faqs = [
  {
    q: "Which universities do you cover?",
    a: "Courses are built for students of the University of Jordan (UJ) and Petra University. Each course is labelled with the university it follows.",
  },
  {
    q: "How do I pay for a course?",
    a: "Each course is bought individually through a secure card checkout. Your access opens as soon as the payment is confirmed.",
  },
  {
    q: "Can I study from my phone?",
    a: "Yes. Lessons, materials and your progress work on phone, tablet and laptop.",
  },
  {
    q: "Can I rewatch lessons before the exam?",
    a: "Yes — every lesson in a course you're enrolled in can be watched as many times as you need.",
  },
  {
    q: "How do I sign in?",
    a: "Enter your email and we'll send you a one-time code — no password to remember. You can also sign in with GitHub.",
  },
];

/* Hero entrance: tw-animate-css utilities, staggered */
const rise =
  "animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both motion-reduce:animate-none";

function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs font-semibold uppercase tracking-[0.14em] text-primary", className)}>
      {children}
    </p>
  );
}

export default async function Home() {
  const [session, courses] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getAllCourses(),
  ]);
  const popular = courses.slice(0, 3);

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="grid items-center gap-14 py-16 md:py-20 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <span
            className={cn(
              rise,
              "inline-flex h-7 items-center gap-1.5 rounded-full bg-brand-soft px-3 text-[13px] font-medium text-primary"
            )}
          >
            <GraduationCap className="size-3.5" aria-hidden="true" />
            Built for University of Jordan &amp; Petra students
          </span>

          <h1
            className={cn(
              rise,
              "delay-100 font-serif text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl"
            )}
          >
            Stop cramming. Start{" "}
            <span className="italic text-primary">passing</span> with
            confidence.
          </h1>

          <p
            className={cn(
              rise,
              "delay-200 max-w-[540px] text-lg leading-relaxed text-muted-foreground md:text-xl"
            )}
          >
            Your hardest university courses, broken into short video lessons
            that follow your syllabus — with the PDFs, past exams and progress
            tracking you need to walk into the exam ready.
          </p>

          <div className={cn(rise, "delay-300 flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row")}>
            <Link className={buttonVariants({ size: "lg" })} href="/courses">
              Find my course
              <ArrowRight aria-hidden="true" />
            </Link>
            {!session && (
              <Link
                className={buttonVariants({ size: "lg", variant: "outline" })}
                href="/login"
              >
                Sign in
              </Link>
            )}
          </div>

          <div
            className={cn(
              rise,
              "delay-500 flex w-full items-center gap-3.5 border-t pt-5"
            )}
          >
            <div className="flex">
              {["bg-thumb-1", "bg-thumb-4", "bg-thumb-2"].map((bg, i) => (
                <span
                  key={bg}
                  aria-hidden="true"
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full border-2 border-background text-thumb-foreground",
                    bg,
                    i > 0 && "-ml-2.5"
                  )}
                >
                  <Users className="size-4" />
                </span>
              ))}
              <span
                aria-hidden="true"
                className="-ml-2.5 flex size-9 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground"
              >
                <Plus className="size-4" />
              </span>
            </div>
            <p className="text-sm leading-snug text-muted-foreground">
              <strong className="font-semibold text-foreground">
                {STUDENT_COUNT} students
              </strong>{" "}
              already study with GATA3A
              <br className="hidden sm:block" /> at UJ and PETRA
            </p>
          </div>
        </div>

        {/* Product preview (decorative) */}
        <div
          aria-hidden="true"
          className={cn(rise, "delay-300 relative hidden h-[500px] lg:block")}
        >
          <div className="absolute inset-y-6 right-0 left-10 rounded-3xl bg-navy dark:bg-card" />
          <div className="absolute top-16 left-0 w-[440px] overflow-hidden rounded-2xl border bg-card shadow-lg">
            <div className="relative flex h-[220px] items-center justify-center bg-foreground dark:bg-black">
              <span className="absolute top-1/2 left-5 -translate-y-1/2 font-serif text-8xl text-white/10">
                ∫ dx
              </span>
              <span className="flex size-16 items-center justify-center rounded-full bg-white text-black">
                <Play className="size-6 fill-current" />
              </span>
              <span className="absolute right-3.5 bottom-3 font-mono text-xs text-white/80">
                12:48
              </span>
            </div>
            <div className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Calculus I · Chapter 4
                </span>
                <UniversityBadge university="UJ" />
              </div>
              <p className="font-serif text-xl">Integration by parts — exam patterns</p>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Course progress</span>
                  <span className="font-mono text-foreground">68%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[68%] rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>

          <div className="animate-float absolute top-0 right-4 flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 shadow-lg">
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-primary">
              <CalendarDays className="size-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">Midterm in</p>
              <p className="font-semibold">12 days · on track</p>
            </div>
          </div>

          <div className="animate-float-slow absolute right-0 bottom-12 flex w-60 flex-col gap-2 rounded-2xl border bg-card px-4 py-3.5 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Course materials
            </p>
            {["Past midterms 2021–2025", "Chapter 4 summary sheet"].map((f) => (
              <span key={f} className="flex items-center gap-2.5 text-[13px]">
                <FileText className="size-4 text-primary" />
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Achievements ---------------- */}
      <Reveal
        as="section"
        className="flex flex-col gap-10 rounded-3xl bg-navy px-6 py-12 text-[#e9eaeb] md:px-14 md:py-14 dark:bg-card"
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end md:gap-12"
        >
          <div className="flex flex-col gap-2.5">
            <Eyebrow className="text-sky">Our achievements</Eyebrow>
            <h2
              id="ach-title"
              className="font-serif text-3xl font-medium leading-tight text-white md:text-[40px]"
            >
              The numbers behind every pass
            </h2>
          </div>
          <p className="max-w-[420px] text-[15px] leading-relaxed text-[#bdbec0]">
            Semester after semester, students at UJ and PETRA come back to
            GATA3A for the courses that decide their GPA.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-8 md:grid-cols-3 lg:grid-cols-5 lg:gap-0">
          {achievements.map((item, i) => (
            <Reveal
              key={item.label}
              delay={i * 90}
              className={cn(
                "flex flex-col gap-2.5 lg:px-6",
                i === 0 && "lg:pl-0",
                i > 0 && "lg:border-l lg:border-white/15",
                i === achievements.length - 1 && "col-span-2 md:col-span-1 lg:pr-0"
              )}
            >
              <item.icon className="size-6 text-sky" aria-hidden="true" />
              <dt className="order-3 text-sm text-[#bdbec0]">{item.label}</dt>
              <dd className="order-2 font-serif text-4xl leading-none text-white md:text-5xl">
                <AnimatedCounter value={item.value} suffix={item.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </Reveal>

      {/* ---------------- Services ---------------- */}
      <section aria-labelledby="svc-title" className="flex flex-col gap-9 py-20 md:py-24">
        <Reveal className="flex flex-col items-center gap-2 text-center">
          <Eyebrow>What you get</Eyebrow>
          <h2 id="svc-title" className="font-serif text-3xl font-medium leading-tight md:text-[40px]">
            Everything you need for the exam, in one place
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal
              key={s.title}
              delay={i * 110}
              className="flex flex-col gap-3.5 rounded-2xl border bg-card p-7 shadow-sm transition-[box-shadow,translate] hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-soft text-primary">
                <s.icon className="size-[22px]" aria-hidden="true" />
              </span>
              <h3 className="mt-1 font-serif text-[23px] font-medium">{s.title}</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{s.description}</p>
              <ul className="mt-auto flex flex-col gap-2 border-t pt-3 text-sm text-muted-foreground">
                {s.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <Check className="size-4 text-primary" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Popular courses ---------------- */}
      {popular.length > 0 && (
        <section className="flex flex-col gap-7 pb-20 md:pb-24">
          <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-col gap-2">
              <Eyebrow>Popular right now</Eyebrow>
              <h2 className="font-serif text-3xl font-medium md:text-[34px]">Start with a course</h2>
            </div>
            <Link href="/courses" className={buttonVariants({ variant: "outline" })}>
              View all courses
              <ArrowRight aria-hidden="true" />
            </Link>
          </Reveal>
          <PopularCourses courses={popular} />
        </section>
      )}

      {/* ---------------- Success stories (shows once testimonials are added) ---------------- */}
      {testimonials.length > 0 && (
        <section id="stories" aria-labelledby="stories-title" className="flex flex-col gap-9 pb-20 md:pb-24">
          <Reveal className="flex flex-col gap-2">
            <Eyebrow>Success stories</Eyebrow>
            <h2 id="stories-title" className="font-serif text-3xl font-medium md:text-[40px]">
              Students who turned it around
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 110}>
                <figure className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-7 shadow-sm">
                  <span className="self-start rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-primary">
                    {t.result}
                  </span>
                  <blockquote className="font-serif text-lg leading-relaxed">“{t.quote}”</blockquote>
                  <figcaption className="mt-auto flex items-center justify-between gap-3 border-t pt-4">
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-[13px] text-muted-foreground">{t.major}</p>
                    </div>
                    <UniversityBadge university={t.university} />
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" aria-labelledby="faq-title" className="grid gap-10 pb-20 md:pb-24 lg:grid-cols-3 lg:gap-12">
        <Reveal className="flex flex-col gap-3">
          <Eyebrow>FAQ</Eyebrow>
          <h2 id="faq-title" className="font-serif text-3xl font-medium leading-tight md:text-[40px]">
            Questions students ask us
          </h2>
        </Reveal>
        <Reveal delay={100} className="border-t lg:col-span-2">
          {faqs.map((f, i) => (
            <details key={f.q} open={i === 0} className="group border-b py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus
                  className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-3 max-w-[680px] text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </Reveal>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <Reveal
        as="section"
        className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-primary px-6 py-12 text-primary-foreground md:flex-row md:items-center md:px-16 md:py-16"
      >
        <div className="flex max-w-[680px] flex-col gap-3">
          <h2 className="font-serif text-3xl font-medium leading-tight md:text-[44px]">
            Your next exam is closer than you think.
          </h2>
          <p className="text-[17px] opacity-85">
            Pick your course today and start the first lesson in under a minute.
          </p>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/courses"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "border-card bg-card text-foreground hover:bg-card/90")}
          >
            Browse courses
            <ArrowRight aria-hidden="true" />
          </Link>
          {!session && (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              )}
            >
              Create free account
            </Link>
          )}
        </div>
      </Reveal>
    </>
  );
}
