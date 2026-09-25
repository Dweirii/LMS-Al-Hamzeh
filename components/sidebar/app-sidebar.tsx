"use client";

import * as React from "react";
import {
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconSearch,
  IconSettings,
  IconUsers,
  IconSchool,
  IconBuilding,
  IconFiles,
} from "@tabler/icons-react";
import { Logo } from "@/components/general/Logo";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Courses",
      url: "/admin/courses",
      icon: IconListDetails,
    },
    {
      title: "User Management",
      url: "/admin/user-management",
      icon: IconUsers,
    },
    {
      title: "Students",
      url: "/admin/students",
      icon: IconSchool,
    },
    {
      title: "Instructors",
      url: "/admin/instructors",
      icon: IconUsers,
    },
    {
      title: "Universities",
      url: "/admin/universities",
      icon: IconBuilding,
    },
    {
      title: "Materials",
      url: "/admin/materials",
      icon: IconFiles,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className={cn("admin-shell", className)}
      {...props}
    >
      <SidebarHeader className="px-3 pt-4 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto hover:bg-transparent active:bg-transparent data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/" className="flex items-center gap-2.5">
                <Logo variant="white" className="h-7 w-auto" />
                <span className="rounded-md border border-sidebar-border px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-sidebar-foreground/80">
                  Admin console
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="p-3">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
