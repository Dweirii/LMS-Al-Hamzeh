import { requireAdmin } from "@/app/data/admin/require-admin";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Guards every current and future page under /admin. Individual data helpers
  // guard themselves as well, so a page that bypasses this layout is still safe.
  await requireAdmin();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 66)",
          "--header-height": "calc(var(--spacing) * 15)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" />
      <SidebarInset>
        <SiteHeader />
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
