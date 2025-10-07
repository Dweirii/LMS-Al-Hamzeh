import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking for orphaned Enrollments...");

  // Collect all valid user IDs and course IDs
  const validUserIds = (await prisma.user.findMany({ select: { id: true } })).map((u) => u.id);
  const validCourseIds = (await prisma.course.findMany({ select: { id: true } })).map((c) => c.id);

  // Delete enrollments where either userId or courseId does not exist
  const result = await prisma.enrollment.deleteMany({
    where: {
      OR: [
        { userId: { notIn: validUserIds } },
        { courseId: { notIn: validCourseIds } },
      ],
    },
  });

  console.log(`🧹 Deleted ${result.count} orphaned Enrollments.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
