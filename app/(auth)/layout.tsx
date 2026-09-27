import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Logo } from "@/components/general/Logo";
import { UniversityBadge } from "@/components/general/UniversityBadge";
import { ThemeToggle } from "@/components/ui/themeToggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden w-[42%] max-w-[600px] flex-col bg-navy px-14 py-12 text-[#e9eaeb] lg:flex dark:bg-[#131e25]">
        <Link href="/" aria-label="GATA3A Academy home" className="flex">
          <Logo variant="white" className="h-11 w-auto" />
        </Link>
        <div className="mt-auto flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky">
            GATA3A Academy
          </p>
          <p className="font-serif text-[44px] leading-[1.08]">
            Elevate your learning experience for a better future.
          </p>
          <p className="max-w-md text-[15px] text-[#bdbec0]">
            Course videos, protected materials and progress tracking for
            University of Jordan and University of Petra students.
          </p>
        </div>
        <div className="mt-9 flex gap-2.5">
          <UniversityBadge university="UJ" long className="bg-white/10 text-white" />
          <UniversityBadge university="PETRA" long className="bg-sky/20 text-white" />
        </div>
      </aside>

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-20">
        <Link
          href="/"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "absolute top-6 left-6",
          })}
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="flex w-full max-w-[400px] flex-col gap-6">
          <Link className="flex self-center lg:hidden" href="/">
            <Logo className="h-12 w-auto" />
          </Link>
          {children}

          <div className="text-balance text-center text-xs leading-relaxed text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <span className="text-primary hover:underline">
              Terms of service
            </span>{" "}
            and{" "}
            <span className="text-primary hover:underline">
              Privacy Policy
            </span>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
