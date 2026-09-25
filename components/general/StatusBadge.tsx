import { cn } from "@/lib/utils";

type StatusTone = "success" | "warning" | "danger" | "neutral";

/**
 * Maps the app's status strings onto the palette:
 * sky/blue = active or published, silver = draft or pending, black = banned or cancelled.
 */
const STATUS_TONES: Record<string, StatusTone> = {
  Published: "success",
  Active: "success",
  Visible: "success",
  Draft: "warning",
  Pending: "warning",
  Hidden: "neutral",
  Archived: "neutral",
  Banned: "danger",
  Cancelled: "danger",
};

const toneClasses: Record<StatusTone, string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  neutral: "bg-muted text-muted-foreground",
};

interface StatusBadgeProps {
  status: string;
  tone?: StatusTone;
  className?: string;
}

export function StatusBadge({ status, tone, className }: StatusBadgeProps) {
  const t = tone ?? STATUS_TONES[status] ?? "neutral";
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs font-medium",
        toneClasses[t],
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  );
}
