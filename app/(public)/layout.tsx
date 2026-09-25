import { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/general/Logo";
import { Navbar } from "./_components/Navbar";

export default function LayoutPublic({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="container mx-auto mb-24 flex-1 px-4 md:px-6 lg:px-8">
        {children}
      </main>
      <footer className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-7 text-[13px] text-muted-foreground sm:flex-row md:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Logo className="h-7 w-auto" />
            <span>GATA3A Academy — for a better future</span>
          </div>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-foreground">
              Terms of service
            </Link>
            <Link href="#" className="hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
