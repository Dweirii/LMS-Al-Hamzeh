import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { isVisible } = body;

    const material = await prisma.material.update({
      where: { id },
      data: { isVisible },
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

    return NextResponse.json(material);
  } catch (error) {
    console.error("Material visibility update error:", error);
    return NextResponse.json(
      { error: "Failed to update material visibility" },
      { status: 500 }
    );
  }
}
