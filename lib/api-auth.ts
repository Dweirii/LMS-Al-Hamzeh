import "server-only";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Authorization helpers for route handlers.
 *
 * The page-level guards in app/data (requireAdmin, requireUser) answer with a
 * redirect, which is correct for a navigation but wrong for a fetch: the caller
 * receives a 307 to /login rather than a status it can act on. These helpers
 * return a JSON response instead.
 *
 * Each returns either { session } or { error }. Call them before the route's
 * try/catch so an authorization failure cannot be swallowed into a 500.
 */

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

// Inferred from the call above rather than from auth.api.getSession directly,
// whose overloads otherwise resolve to the wrong shape.
type Session = NonNullable<Awaited<ReturnType<typeof getSession>>>;
type Guard = { session: Session; error?: never } | { session?: never; error: NextResponse };

/** Any signed-in user. */
export async function requireApiUser(): Promise<Guard> {
  const session = await getSession();

  if (!session?.user) {
    return {
      error: NextResponse.json({ error: "Authentication required" }, { status: 401 }),
    };
  }

  return { session };
}

/** Signed-in users with the admin role. */
export async function requireApiAdmin(): Promise<Guard> {
  const result = await requireApiUser();
  if (result.error) return result;

  if (result.session.user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Admin access required" }, { status: 403 }),
    };
  }

  return result;
}

/**
 * Admins, or students with an active enrollment in the course. Used to gate
 * paid course content such as material download links.
 */
export async function requireCourseAccess(courseId: string): Promise<Guard> {
  const result = await requireApiUser();
  if (result.error) return result;

  if (result.session.user.role === "admin") return result;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: result.session.user.id, courseId },
    },
    select: { status: true },
  });

  if (enrollment?.status !== "Active") {
    return {
      error: NextResponse.json({ error: "Course enrollment required" }, { status: 403 }),
    };
  }

  return result;
}
