import { NextRequest, NextResponse } from "next/server";
import { S3 } from "@/lib/S3Client";
import { prisma } from "@/lib/db";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const material = await prisma.material.findUnique({
      where: { id },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    // Generate presigned URL for viewing
    const command = new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES!,
      Key: material.fileKey,
    });
    const viewUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });

    // Return JSON instead of redirect to avoid Chrome blocking in sandboxed iframe
    return NextResponse.json({ url: viewUrl });
  } catch (error) {
    console.error("Material view error:", error);
    return NextResponse.json(
      { error: "Failed to generate view link" },
      { status: 500 }
    );
  }
}

