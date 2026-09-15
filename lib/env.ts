import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),

    // Read by better-auth from the environment rather than through this object,
    // but declared here so a missing or too-short secret fails at boot.
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
    // Must match the origin the app is served from, or better-auth rejects
    // requests as coming from an untrusted origin.
    BETTER_AUTH_URL: z.string().url(),

    AUTH_GITHUB_ID: z.string().min(1),
    AUTH_GITHUB_SECRET: z.string().min(1),

    RESEND_API_KEY: z.string().startsWith("re_", "Resend keys start with re_"),
    // Must be on a domain verified in Resend. The default onboarding@resend.dev
    // only delivers to the Resend account owner, so sign-in emails silently fail
    // for everyone else.
    RESEND_FROM_EMAIL: z.string().min(1),

    ARCJET_KEY: z.string().min(1),

    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_ENDPOINT_URL_S3: z.string().url(),
    AWS_REGION: z.string().min(1).default("auto"),

    STRIPE_SECRET_KEY: z
      .string()
      .startsWith("sk_", "Stripe secret keys start with sk_"),
    STRIPE_WEBHOOK_SECRET: z
      .string()
      .startsWith("whsec_", "Stripe webhook secrets start with whsec_"),
  },

  client: {
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES: z.string().min(1),
  },

  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES:
      process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
  },

  // Lets a container image be built without production secrets. Never set this
  // at runtime: it disables the checks that catch a misconfigured deployment.
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",

  emptyStringAsUndefined: true,
});
