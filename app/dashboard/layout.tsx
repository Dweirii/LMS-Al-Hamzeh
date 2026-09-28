import { requireUser } from "@/app/data/user/require-user";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { AppSidebar } from "./_components/DashboardAppSidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Check the session before rendering the shell, so signed-out visitors are
  // redirected to /login straight away instead of briefly seeing the dashboard.
  await requireUser();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 66)",
          "--header-height": "calc(var(--spacing) * 15)",
        } as React.CSSProperties
      }
    >
      {/* "icon" collapses to a rail instead of hiding the student nav entirely. */}
      <AppSidebar variant="sidebar" collapsible="icon" />
      <SidebarInset>
        <SiteHeader className="sticky top-0 z-30" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 px-4 py-6 md:gap-7 lg:px-9 lg:py-8">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
