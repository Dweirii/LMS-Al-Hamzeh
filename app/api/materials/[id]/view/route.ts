import { NextRequest, NextResponse } from "next/server";
import { S3 } from "@/lib/S3Client";
import { prisma } from "@/lib/db";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { requireCourseAccess } from "@/lib/api-auth";
import { env } from "@/lib/env";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  const material = await prisma.material.findUnique({
    where: { id },
  });

  if (!material) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  }

  // This route hands out a signed, time-limited link to paid course content, so
  // it must be gated on enrollment. Without this check any visitor holding a
  // material id could download the file.
  const auth = await requireCourseAccess(material.courseId);
  if (auth.error) return auth.error;

  if (!material.isVisible && auth.session.user.role !== "admin") {
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  }

  try {

    // Seeded and imported materials can hold an absolute URL rather than an S3
    // object key; serve those directly instead of presigning a key that does not
    // exist in the bucket.
    if (/^https?:\/\//i.test(material.fileKey)) {
      return NextResponse.json({ url: material.fileKey });
    }

    // Generate presigned URL for viewing
    const command = new GetObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: material.fileKey,
    });
    const viewUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });

    // Return JSON instead of redirect to avoid Chrome blocking in sandboxed iframe
    return NextResponse.json({ url: viewUrl }, {
      headers: {
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error("Material view error:", error);
    return NextResponse.json(
      { error: "Failed to generate view link" },
      { status: 500 }
    );
  }
}

