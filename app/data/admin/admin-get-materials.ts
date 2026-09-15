import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getMaterials() {
  await requireAdmin();

  try {
    const materials = await prisma.material.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return materials;
  } catch (error) {
    console.error("Error fetching materials:", error);
    return [];
  }
}

export async function getMaterialById(id: string) {
  await requireAdmin();

  try {
    const material = await prisma.material.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return material;
  } catch (error) {
    console.error("Error fetching material:", error);
    return null;
  }
}

export async function getMaterialsByCourseId(courseId: string) {
  await requireAdmin();

  try {
    const materials = await prisma.material.findMany({
      where: {
        courseId: courseId,
        isVisible: true,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return materials;
  } catch (error) {
    console.error("Error fetching materials by course:", error);
    return [];
  }
}

export async function getCourses() {
  await requireAdmin();

  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

