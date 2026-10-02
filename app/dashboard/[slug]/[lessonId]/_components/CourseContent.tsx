"use client";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { BookIcon, CheckCircle, ShieldCheck } from "lucide-react";
import { useTransition, useEffect, useRef } from "react";
import { markLessonComplete } from "../actions";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";
import { useWatchTracking } from "@/hooks/use-watch-tracking";

interface iAppProps {
  data: LessonContentType;
}

// Defined at module level: a component declared inside CourseContent would be
// a new type on every render, remounting the video (and resetting playback and
// watch tracking) whenever the parent re-renders.
function VideoPlayer({
  lessonId,
  thumbnailKey,
  videoKey,
}: {
  lessonId: string;
  thumbnailKey: string;
  videoKey: string;
}) {
  const videoUrl = useConstructUrl(videoKey);
  const thumbnailUrl = useConstructUrl(thumbnailKey);
  const lastWarningTime = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useWatchTracking(videoRef, lessonId);

  useEffect(() => {
    // Show warning toast with cooldown (once every 10 seconds)
    const showProtectionWarning = () => {
      const now = Date.now();
      if (now - lastWarningTime.current > 10000) {
        toast.error("⚠️ Content Protected", {
          description: "This content is protected by copyright. Unauthorized download, recording, or distribution may result in legal action.",
          duration: 5000,
        });
        lastWarningTime.current = now;
      }
    };

    // Detect DevTools opening via size change detection
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        showProtectionWarning();
      }
    };

    // Keyboard shortcuts detection
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u"))
      ) {
        e.preventDefault();
        showProtectionWarning();
      }

      // Cmd+Option+I, Cmd+Option+J, Cmd+Option+C for Mac
      if (
        (e.metaKey && e.altKey && (e.key === "I" || e.key === "i")) ||
        (e.metaKey && e.altKey && (e.key === "J" || e.key === "j")) ||
        (e.metaKey && e.altKey && (e.key === "C" || e.key === "c"))
      ) {
        e.preventDefault();
        showProtectionWarning();
      }
    };

    // Right-click detection
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("video")) {
        showProtectionWarning();
      }
    };

    // Check for DevTools periodically
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    // Cleanup
    return () => {
      clearInterval(devToolsInterval);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  if (!videoKey) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center rounded-xl bg-muted">
        <BookIcon className="mx-auto mb-4 size-14 text-primary" />
        <p className="text-muted-foreground">
          This lesson does not have a video yet
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black shadow-md">
      <span className="pointer-events-none absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-xs text-white/85">
        <ShieldCheck className="size-3.5" aria-hidden="true" />
        Protected content
      </span>
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture={false}
        poster={thumbnailUrl}
        preload="metadata"
        playsInline
        onContextMenu={(e) => e.preventDefault()}
        style={{
          maxHeight: '100%',
          width: '100%',
          display: 'block',
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export function CourseContent({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        markLessonComplete(data.id, data.Chapter.Course.slug)
      );

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="flex h-full flex-col gap-5 bg-background p-4 sm:p-6 lg:px-9 lg:py-7">
      <VideoPlayer
        key={data.id}
        lessonId={data.id}
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />

      <div className="border-b pb-5">
        {data.lessonProgress.some((progress) => progress.completed) ? (
          <Button
            variant="outline"
            className="w-full border-transparent bg-success-soft text-success hover:bg-success-soft hover:text-success sm:w-auto"
          >
            <CheckCircle className="size-4" />
            Completed
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={onSubmit}
            disabled={pending}
            className="w-full border-success text-success hover:bg-success-soft hover:text-success sm:w-auto"
          >
            <CheckCircle className="size-4" />
            Mark as Complete
          </Button>
        )}
      </div>

      <div className="space-y-3 overflow-y-auto">
        <h1 className="font-serif text-2xl font-medium tracking-tight text-foreground lg:text-[34px]">
          {data.title}
        </h1>

        {data.description && (
          <div className="prose prose-sm sm:prose max-w-3xl text-muted-foreground dark:prose-invert">
            <RenderDescription json={data.description} />
          </div>
        )}
      </div>
    </div>
  );
}
