import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "danger" | "petra";

const toneClasses: Record<Tone, { tile: string; value: string }> = {
  primary: { tile: "bg-brand-soft text-primary", value: "text-foreground" },
  success: { tile: "bg-success-soft text-success", value: "text-success" },
  danger: { tile: "bg-danger-soft text-danger", value: "text-danger" },
  petra: { tile: "bg-petra-soft text-petra", value: "text-petra" },
};

interface StatCardProps {
  title: string;
  value: ReactNode;
  description?: ReactNode;
  icon: ReactNode;
  tone?: Tone;
  /** Colour the number with the tone colour (used for status counts). */
  colorValue?: boolean;
  children?: ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  tone = "primary",
  colorValue = false,
  children,
  className,
}: StatCardProps) {
  const t = toneClasses[tone];
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-muted-foreground">
            {title}
          </span>
          <span
            className={cn(
              "font-serif text-3xl leading-tight tabular-nums",
              colorValue ? t.value : "text-foreground"
            )}
          >
            {value}
          </span>
        </div>
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg]:size-5",
            t.tile
          )}
        >
          {icon}
        </span>
      </div>
      {children}
      {description && (
        <p className="text-[12.5px] text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
