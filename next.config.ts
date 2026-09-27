import type { NextConfig } from "next";

// Hosts used only by locally seeded sample content. They are dropped from the
// production config so the deployed app still only trusts the storage bucket.
const devOnlyImageHosts =
  process.env.NODE_ENV === "production"
    ? []
    : ([
        { protocol: "https", hostname: "picsum.photos" },
        { protocol: "https", hostname: "fastly.picsum.photos" },
        { protocol: "https", hostname: "images.unsplash.com" },
      ] as const);

// Public host of the Tigris bucket. Must match the host built in
// hooks/use-construct-url.ts, or next/image rejects every thumbnail with a 400.
const bucketHost = `${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES ?? "gata3a"}.t3.tigrisfiles.io`;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: bucketHost,
      },
      ...devOnlyImageHosts,
    ],
  },
};

export default nextConfig;
