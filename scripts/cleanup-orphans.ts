import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking for orphaned Chapters...");

  // احذف كل الـ Chapters اللي ما إلها Course موجود
  const result = await prisma.chapter.deleteMany({
    where: {
      courseId: {
        notIn: (await prisma.course.findMany({ select: { id: true } })).map(
          (c) => c.id
        ),
      },
    },
  });

  console.log(`🧹 Deleted ${result.count} orphaned Chapters.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
