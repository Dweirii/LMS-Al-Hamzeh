-- Per-lesson video watch tracking, so admins can see how much of each video a
-- student actually played (independent of "Mark as Complete").
ALTER TABLE "public"."LessonProgress"
  ADD COLUMN "completedAt" TIMESTAMP(3),
  ADD COLUMN "watchedRanges" JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "watchedSeconds" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "videoDuration" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastPosition" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastWatchedAt" TIMESTAMP(3);
