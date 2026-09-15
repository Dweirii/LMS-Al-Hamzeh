import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/S3Client";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { requireApiAdmin } from "@/lib/api-auth";

// Mirrors the limits the uploader applies in the browser. Without these the
// presigned URL would accept any content type at any size, since both values
// are supplied by the client.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 5000 * 1024 * 1024;

const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "Filename is required" }).max(255),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().int().positive({ message: "Size is required" }),
  isImage: z.boolean(),
});

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

/** Strips directory separators and anything else awkward in an object key. */
function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^\w.\-]+/g, "_").replace(/^\.+/, "");
}

export async function POST(request: Request) {
  const auth = await requireApiAdmin();
  if (auth.error) return auth.error;

  try {
    const decision = await aj.protect(request, {
      fingerprint: auth.session.user.id,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Too many uploads. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Request Body" },
        { status: 400 }
      );
    }

    const { fileName, contentType, size, isImage } = validation.data;

    const expectedPrefix = isImage ? "image/" : "video/";
    if (!contentType.startsWith(expectedPrefix)) {
      return NextResponse.json(
        { error: `Expected ${expectedPrefix}* but received ${contentType}` },
        { status: 400 }
      );
    }

    const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
    if (size > maxBytes) {
      return NextResponse.json(
        {
          error: `File is too large. Maximum is ${Math.floor(
            maxBytes / (1024 * 1024)
          )}MB.`,
        },
        { status: 400 }
      );
    }

    const uniqueKey = `${uuidv4()}-${sanitizeFileName(fileName)}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360, // URL expires in 6 minutes
    });

    return NextResponse.json({ presignedUrl, key: uniqueKey });
  } catch (error) {
    console.error("S3 presign error:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
