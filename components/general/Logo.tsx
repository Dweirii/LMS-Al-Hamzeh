import Image from "next/image";
import { cn } from "@/lib/utils";
import LogoColor from "@/public/gata3a-logo.svg";
import LogoWhite from "@/public/gata3a-logo-white.svg";

interface LogoProps {
  /**
   * "auto"  – colour logo in light mode, bold white logo in dark mode.
   * "white" – always the bold white logo (for dark surfaces such as the admin sidebar).
   */
  variant?: "auto" | "white";
  className?: string;
  priority?: boolean;
}

export function Logo({ variant = "auto", className, priority }: LogoProps) {
  if (variant === "white") {
    return (
      <Image
        src={LogoWhite}
        alt="GATA3A Academy"
        className={cn("h-8 w-auto", className)}
        priority={priority}
      />
    );
  }

  return (
    <>
      <Image
        src={LogoColor}
        alt="GATA3A Academy"
        className={cn("h-8 w-auto dark:hidden", className)}
        priority={priority}
      />
      <Image
        src={LogoWhite}
        alt="GATA3A Academy"
        className={cn("hidden h-8 w-auto dark:block", className)}
        priority={priority}
      />
    </>
  );
}
