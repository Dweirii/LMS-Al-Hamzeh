"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StatusBadge } from "@/components/general/StatusBadge";
import { formatSeconds, watchedPercent } from "@/lib/watch-progress";
import { format } from "date-fns";
import { AlertTriangle, ChevronDown, PlayCircle } from "lucide-react";
import { LessonWatchDetails, StudentDetails } from "../../actions";

// Marking a lesson complete after watching less than this share of the video
// is flagged for the admin.
const LOW_WATCH_PERCENT = 80;

type Chapters = StudentDetails["enrollments"][number]["chapters"];

export function LessonWatchProgress({ chapters }: { chapters: Chapters }) {
  const lessons = chapters.flatMap((chapter) => chapter.lessons);
  const videoLessons = lessons.filter((lesson) => lesson.hasVideo);
  const watched = videoLessons.reduce((sum, l) => sum + l.watchedSeconds, 0);
  const tracked = videoLessons.reduce((sum, l) => sum + l.videoDuration, 0);
  const flagged = lessons.filter(isFlagged).length;

  if (lessons.length === 0) return null;

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="group/watch -ml-2 h-auto gap-2 px-2 py-1.5 text-[13px] text-muted-foreground"
        >
          <ChevronDown className="size-4 -rotate-90 transition-transform group-data-[state=open]/watch:rotate-0" />
          Video watch progress
          {tracked > 0 && (
            <span className="font-mono">
              · {formatSeconds(watched)} watched
            </span>
          )}
          {flagged > 0 && (
            <span className="inline-flex items-center gap-1 text-warning">
              · <AlertTriangle className="size-3.5" />
              {flagged} completed without watching
            </span>
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-4">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="space-y-1.5">
            <p className="text-[12.5px] font-semibold text-muted-foreground uppercase tracking-wide">
              {chapter.title}
            </p>
            {chapter.lessons.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">No lessons</p>
            ) : (
              <ul className="divide-y rounded-lg border">
                {chapter.lessons.map((lesson) => (
                  <LessonRow key={lesson.id} lesson={lesson} />
                ))}
              </ul>
            )}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function isFlagged(lesson: LessonWatchDetails) {
  return (
    lesson.completed &&
    lesson.hasVideo &&
    watchedPercent(lesson.watchedSeconds, lesson.videoDuration) < LOW_WATCH_PERCENT
  );
}

function LessonRow({ lesson }: { lesson: LessonWatchDetails }) {
  const percent = watchedPercent(lesson.watchedSeconds, lesson.videoDuration);
  const started = lesson.watchedSeconds > 0;

  return (
    <li className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <PlayCircle className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-[13.5px] font-medium">{lesson.title}</span>
          {lesson.completed && <StatusBadge status="Completed" tone="success" />}
        </div>
        <p className="text-xs text-muted-foreground">
          {[
            lesson.completedAt &&
              `Marked complete ${format(lesson.completedAt, "MMM d, yyyy")}`,
            lesson.lastWatchedAt &&
              `Last watched ${format(lesson.lastWatchedAt, "MMM d, yyyy 'at' h:mm a")}`,
          ]
            .filter(Boolean)
            .join(" · ") || (lesson.completed ? "Marked complete" : "Not started")}
        </p>
        {isFlagged(lesson) && (
          <p className="inline-flex items-center gap-1 text-xs font-medium text-warning">
            <AlertTriangle className="size-3.5" />
            Marked complete after watching only {percent}% of the video
          </p>
        )}
      </div>

      <div className="w-full shrink-0 space-y-1 sm:w-64">
        {!lesson.hasVideo ? (
          <p className="text-xs text-muted-foreground sm:text-right">No video</p>
        ) : !started ? (
          <>
            <WatchTimeline lesson={lesson} />
            <p className="text-xs text-muted-foreground sm:text-right">
              Not watched yet
            </p>
          </>
        ) : (
          <>
            <WatchTimeline lesson={lesson} />
            <p className="flex justify-between font-mono text-xs">
              <span className="text-muted-foreground">
                {formatSeconds(lesson.watchedSeconds)} / {formatSeconds(lesson.videoDuration)}
              </span>
              <span className="font-medium">{percent}%</span>
            </p>
          </>
        )}
      </div>
    </li>
  );
}

/**
 * The video's length as a bar, with the parts the student actually played
 * filled in. Gaps are sections that were skipped or never reached.
 */
function WatchTimeline({ lesson }: { lesson: LessonWatchDetails }) {
  const duration = lesson.videoDuration;
  const percent = watchedPercent(lesson.watchedSeconds, duration);

  return (
    <div
      role="img"
      aria-label={`Watched ${percent}% of the video`}
      title={lesson.watchedRanges
        .map(([start, end]) => `${formatSeconds(start)} – ${formatSeconds(end)}`)
        .join("\n")}
      className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
    >
      {duration > 0 &&
        lesson.watchedRanges.map(([start, end]) => (
          <span
            key={start}
            className="absolute inset-y-0 bg-primary"
            style={{
              left: `${(start / duration) * 100}%`,
              width: `${Math.max(((end - start) / duration) * 100, 0.5)}%`,
            }}
          />
        ))}
    </div>
  );
}
