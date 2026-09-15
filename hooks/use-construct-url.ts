import { env } from "@/lib/env";

/**
 * Builds a public URL for a stored object.
 *
 * Records normally hold an S3 object key, but seeded and imported rows can hold an
 * absolute URL instead. Those are passed through untouched rather than being
 * prefixed with the bucket host, which would produce an unreachable URL.
 */
export function useConstructUrl(key: string): string {
  if (/^https?:\/\//i.test(key)) {
    return key;
  }

  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${key}`;
}
