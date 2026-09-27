import { env } from "@/lib/env";

// Shown for courses created without a thumbnail (they store an empty key).
export const DEFAULT_COURSE_THUMBNAIL = "/course-default-thumbnail.svg";

/**
 * Builds a public URL for a stored object.
 *
 * Records normally hold an S3 object key, but seeded and imported rows can hold an
 * absolute URL instead. Those are passed through untouched rather than being
 * prefixed with the bucket host, which would produce an unreachable URL.
 *
 * Not actually a hook, so server components can call it as `constructUrl`.
 */
export function constructUrl(key: string): string {
  if (!key) {
    return DEFAULT_COURSE_THUMBNAIL;
  }

  if (/^https?:\/\//i.test(key)) {
    return key;
  }

  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${key}`;
}

export const useConstructUrl = constructUrl;
