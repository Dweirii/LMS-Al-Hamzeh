import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lms-alhamzeh.fly.storage.tigris.dev",
      },
    ],
  },
};

export default nextConfig;
