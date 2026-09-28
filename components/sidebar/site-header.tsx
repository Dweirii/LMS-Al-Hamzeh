"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ThemeToggle } from "../ui/themeToggle";
import { cn } from "@/lib/utils";

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  courses: "Courses",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  materials: "Materials",
  students: "Students",
  instructors: "Instructors",
  universities: "Universities",
  "user-management": "User Management",
};

const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toLabel(segment: string) {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  if (ID_PATTERN.test(segment) || segment.length > 24) return "Details";
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// The href for the crumb ending at segments[index], or null when that prefix has no
// page: /admin/courses/<courseId> goes to its edit page, and a chapter id
// (/admin/courses/<courseId>/<chapterId>) has nowhere to go.
function toHref(segments: string[], index: number) {
  const path = segments.slice(0, index + 1);
  const href = `/${path.join("/")}`;
  if (path[0] === "admin" && path[1] === "courses" && ID_PATTERN.test(path[2] ?? "")) {
    if (path.length === 3) return `${href}/edit`;
    if (path.length === 4 && ID_PATTERN.test(path[3])) return null;
  }
  return href;
}

export function SiteHeader({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map(toLabel);

  return (
    <header
      className={cn(
        "flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)",
        className
      )}
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-2 text-sm"
        >
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            const href = isLast ? null : toHref(segments, index);
            return (
              <Fragment key={`${crumb}-${index}`}>
                {index > 0 && (
                  <ChevronRight
                    className="size-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
                {href ? (
                  <BreadcrumbLink asChild className="truncate text-muted-foreground">
                    <Link href={href}>{crumb}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span
                    className={
                      isLast
                        ? "truncate font-medium text-foreground"
                        : "truncate text-muted-foreground"
                    }
                    aria-current={isLast ? "page" : undefined}
                  >
                    {crumb}
                  </span>
                )}
              </Fragment>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
