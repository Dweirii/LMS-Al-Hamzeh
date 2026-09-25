import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UniversityBadge } from "@/components/general/UniversityBadge";
import {
  ArrowRight,
  BookOpen,
  Layers,
  Sparkles,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

interface featureProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const features: featureProps[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Access a wide range of carefully curated courses designed by industry experts.",
    icon: BookOpen,
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
    icon: Layers,
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
    icon: TrendingUp,
  },
  {
    title: "Community Support",
    description:
      "Join a vibrant community of learners and instructors to collaborate and share knowledge.",
    icon: Users,
  },
];

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <section className="relative py-20 md:py-24">
        <div className="flex flex-col items-center space-y-6 text-center">
          <Badge
            variant="outline"
            className="h-7 gap-1.5 border-transparent bg-brand-soft px-3 text-primary"
          >
            <Sparkles aria-hidden="true" />
            The Future of Online Education
          </Badge>
          <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl">
            Elevate your{" "}
            <span className="italic text-primary">Learning</span> Experience
          </h1>
          <p className="max-w-[640px] text-lg leading-relaxed text-muted-foreground md:text-xl">
            Discover a new way to learn with our modern, interactive learning
            management system. Access high-quality courses anytime, anywhere.
          </p>

          <div className="flex flex-col gap-3 pt-3 sm:flex-row">
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href="/courses"
            >
              Explore Courses
              <ArrowRight aria-hidden="true" />
            </Link>

            {!session && (
              <Link
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                })}
                href="/login"
              >
                Sign in
              </Link>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-6 text-[13px] text-muted-foreground">
            <span>Courses for students of</span>
            <UniversityBadge university="UJ" long />
            <UniversityBadge university="PETRA" long />
          </div>
        </div>
      </section>

      <section
        aria-label="Features"
        className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
      >
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="gap-4 transition-shadow hover:shadow-lg"
          >
            <CardHeader className="gap-5">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-primary">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <CardTitle className="font-serif text-xl font-medium">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
