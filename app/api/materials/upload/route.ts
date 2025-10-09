import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { S3 } from "@/lib/S3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const courseId = formData.get("courseId") as string;
    const file = formData.get("file") as File;

    if (!title || !courseId || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Upload file to S3
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileKey = `materials/${courseId}/${Date.now()}-${file.name}`;
    
    await S3.send(new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES!,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
    }));

    // Create material record
    const material = await prisma.material.create({
      data: {
        title,
        fileKey,
        courseId,
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
    });

    return NextResponse.json(material);
  } catch (error) {
    console.error("Material upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload material" },
      { status: 500 }
    );
  }
}

