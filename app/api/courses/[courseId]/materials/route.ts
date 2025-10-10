import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface RouteParams {
  params: Promise<{
    courseId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { courseId } = await params;
    
    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          courseId: courseId,
          userId: session.user.id,
        },
      },
      select: {
        status: true,
      },
    });

    if (!enrollment || enrollment.status !== "Active") {
      return NextResponse.json(
        { error: "Course enrollment required" },
        { status: 403 }
      );
    }

    // Get materials for the course
    const materials = await prisma.material.findMany({
      where: {
        courseId: courseId,
        isVisible: true,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(materials);
  } catch (error) {
    console.error("Course materials fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch materials" },
      { status: 500 }
    );
  }
}
