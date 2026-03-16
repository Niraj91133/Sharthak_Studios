import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix for Turbopack root as suggested by Next.js warning
  // @ts-ignore
  turbopack: {
    root: "/Users/Niraj/Desktop/sharthak-studio-next",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
