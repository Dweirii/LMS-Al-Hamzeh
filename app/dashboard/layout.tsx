import { requireUser } from "@/app/data/user/require-user";
import { Navbar } from "@/app/(public)/_components/Navbar";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Check the session before rendering the shell, so signed-out visitors are
  // redirected to /login straight away instead of briefly seeing the dashboard.
  await requireUser();

  return (
    <div
      className="flex min-h-svh flex-col"
      style={
        {
          // The Navbar's 68px row plus its 1px bottom border; the course pages pin
          // their sidebars just below it.
          "--header-height": "69px",
        } as React.CSSProperties
      }
    >
      <Navbar />
      <main className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-6 px-4 py-6 md:gap-7 lg:px-9 lg:py-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
