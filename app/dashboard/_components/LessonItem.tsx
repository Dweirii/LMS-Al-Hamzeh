import { cn } from "@/lib/utils";
import { Check, Play } from "lucide-react";
import Link from "next/link";

interface iAppProps {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
  };
  slug: string;
  isActive?: boolean;
  completed: boolean;
}

export function LessonItem({ lesson, slug, isActive, completed }: iAppProps) {
  return (
    <Link
      href={`/dashboard/${slug}/${lesson.id}`}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors",
        isActive ? "bg-brand-soft" : "hover:bg-muted"
      )}
    >
      <div className="shrink-0">
        {completed ? (
          <div className="flex size-[22px] items-center justify-center rounded-full bg-success text-card">
            <Check className="size-3" strokeWidth={2.5} />
          </div>
        ) : isActive ? (
          <div className="flex size-[22px] items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Play className="size-2.5 fill-current" />
          </div>
        ) : (
          <div className="flex size-[22px] items-center justify-center rounded-full border-[1.5px] border-input text-muted-foreground">
            <Play className="size-2 fill-current" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p
          className={cn(
            "truncate text-[13.5px] font-medium",
            completed
              ? "text-muted-foreground"
              : isActive
                ? "text-primary"
                : "text-foreground"
          )}
        >
          {lesson.position}. {lesson.title}
        </p>
        {completed && (
          <p className="text-[11.5px] font-medium text-success">Completed</p>
        )}
        {isActive && !completed && (
          <p className="text-[11.5px] font-semibold text-primary">
            Currently Watching
          </p>
        )}
      </div>
    </Link>
  );
}
