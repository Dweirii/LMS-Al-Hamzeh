import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

/**
 * Users for the admin user-management table.
 *
 * Selects explicitly rather than returning the whole row: the user table also
 * holds the Stripe customer id and other fields the table does not render, and
 * everything selected here is serialised to the client.
 */
export async function adminGetUsers() {
  await requireAdmin();

  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      banReason: true,
      banExpires: true,
      createdAt: true,
    },
  });
}
