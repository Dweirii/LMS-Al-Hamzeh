import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireCourseAccess } from "@/lib/api-auth";
import {
  MAX_WATCH_RANGES,
  mergeRanges,
  sanitizeRanges,
  totalWatched,
} from "@/lib/watch-progress";

interface RouteParams {
  params: Promise<{
    lessonId: string;
  }>;
}

// Videos longer than this are treated as a bad report.
const MAX_DURATION_SECONDS = 24 * 60 * 60;

/**
 * Records which parts of a lesson video the student played. The player sends
 * the spans watched since its last report; they are merged into the stored
 * spans so the total only grows by time not already counted.
 *
 * Called with fetch(keepalive) and navigator.sendBeacon, so the body is read
 * as text: a beacon arrives as text/plain.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { lessonId } = await params;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: { Chapter: { select: { courseId: true } } },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const auth = await requireCourseAccess(lesson.Chapter.courseId);
  if (auth.error) return auth.error;

  let body: { ranges?: unknown; duration?: unknown; position?: unknown };
  try {
    body = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const duration = Number(body.duration);
  if (!Number.isFinite(duration) || duration <= 0 || duration > MAX_DURATION_SECONDS) {
    return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
  }

  const position = Number(body.position);
  const incoming = sanitizeRanges(body.ranges, duration);

  try {
    const userId = auth.session.user.id;
    const existing = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
      select: { watchedRanges: true },
    });

    const ranges = mergeRanges([
      ...sanitizeRanges(existing?.watchedRanges, duration),
      ...incoming,
    ]).slice(0, MAX_WATCH_RANGES);

    const watch = {
      watchedRanges: ranges,
      watchedSeconds: Math.round(totalWatched(ranges)),
      videoDuration: Math.round(duration),
      lastPosition: Number.isFinite(position)
        ? Math.round(Math.min(Math.max(position, 0), duration))
        : 0,
      lastWatchedAt: new Date(),
    };

    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: watch,
      create: { userId, lessonId, completed: false, ...watch },
    });

    return NextResponse.json({ watchedSeconds: watch.watchedSeconds });
  } catch {
    return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
  }
}
