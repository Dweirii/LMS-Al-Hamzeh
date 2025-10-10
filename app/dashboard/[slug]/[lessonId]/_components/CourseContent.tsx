"use client";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { BookIcon, CheckCircle } from "lucide-react";
import { useTransition, useEffect, useRef } from "react";
import { markLessonComplete } from "../actions";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";

interface iAppProps {
  data: LessonContentType;
}

export function CourseContent({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();

  function VideoPlayer({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string;
    videoKey: string;
  }) {
    const videoUrl = useConstructUrl(videoKey);
    const thumbnailUrl = useConstructUrl(thumbnailKey);
    const lastWarningTime = useRef<number>(0);

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
        <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
          <BookIcon className="size-16 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            This lesson does not have a video yet
          </p>
        </div>
      );
    }

    return (
      <div className="aspect-video bg-black rounded-lg relative overflow-hidden shadow-xl">
        <video
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
    <div className="flex flex-col h-full bg-background p-3 sm:p-4 lg:pl-6 lg:p-0">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />

      <div className="py-3 sm:py-4 border-b">
        {data.lessonProgress.length > 0 ? (
          <Button
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:text-green-600 w-full sm:w-auto text-sm"
            size="sm"
          >
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={onSubmit} 
            disabled={pending}
            className="w-full sm:w-auto text-sm"
            size="sm"
          >
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Mark as Complete
          </Button>
        )}
      </div>

      <div className="space-y-2 sm:space-y-3 pt-3 overflow-y-auto">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>

        {data.description && (
          <div className="prose prose-sm sm:prose max-w-none">
            <RenderDescription json={JSON.parse(data.description)} />
          </div>
        )}
      </div>
    </div>
  );
}
