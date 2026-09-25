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

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gata3a.t3.tigrisfiles.io",
      },
      ...devOnlyImageHosts,
    ],
  },
};

export default nextConfig;
