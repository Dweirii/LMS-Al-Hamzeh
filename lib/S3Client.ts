import "server-only";

import { S3Client } from "@aws-sdk/client-s3";
import { env } from "./env";

// Credentials are passed explicitly rather than left to the SDK's default
// provider chain, so a missing key fails validation at boot instead of
// surfacing as an opaque error on the first upload.
export const S3 = new S3Client({
  region: env.AWS_REGION,
  endpoint: env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: false,
});
