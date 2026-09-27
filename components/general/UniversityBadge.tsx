import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UniversityBadgeProps {
  university: string;
  /** Show the full university name instead of the short code. */
  long?: boolean;
  className?: string;
}

export function UniversityBadge({
  university,
  long = false,
  className,
}: UniversityBadgeProps) {
  const isUJ = university === "UJ";
  const label = isUJ
    ? long
      ? "University of Jordan"
      : "UJ"
    : long
      ? "University of Petra"
      : "PETRA";

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs font-medium",
        isUJ ? "bg-uj-soft text-uj" : "bg-petra-soft text-petra",
        className
      )}
    >
      <Building2 className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
