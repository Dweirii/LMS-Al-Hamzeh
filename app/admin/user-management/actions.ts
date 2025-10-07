"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function banUserAction(
  id: string,
  reason: string,
  expires?: Date
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    await prisma.user.update({
      where: { id },
      data: { 
        banned: true, 
        banReason: reason, 
        banExpires: expires || null 
      },
    });

    revalidatePath("/admin/user-management");
    return {
      status: "success",
      message: "User banned successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to ban user",
    };
  }
}

export async function unbanUserAction(id: string): Promise<ApiResponse> {
  await requireAdmin();
  try {
    await prisma.user.update({
      where: { id },
      data: { 
        banned: false, 
        banReason: null, 
        banExpires: null 
      },
    });

    revalidatePath("/admin/user-management");
    return {
      status: "success",
      message: "User unbanned successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to unban user",
    };
  }
}

export async function updateUserRoleAction(
  id: string,
  role: string
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    await prisma.user.update({
      where: { id },
      data: { role },
    });

    revalidatePath("/admin/user-management");
    return {
      status: "success",
      message: "User role updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update user role",
    };
  }
}
