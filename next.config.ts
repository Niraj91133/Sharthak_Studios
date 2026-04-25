import type { NextConfig } from "next";
import path from "node:path";

const disableImageOptimization = process.env.NEXT_PUBLIC_DISABLE_IMAGE_OPTIMIZATION === "true";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    // If you deploy to static-only hosting (no Node Next server), `/_next/image` will 404.
    // Set `NEXT_PUBLIC_DISABLE_IMAGE_OPTIMIZATION=true` to make <Image /> render unoptimized URLs.
    unoptimized: disableImageOptimization,
    formats: ['image/avif', 'image/webp'],
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
      {
        protocol: "https",
        hostname: "crpynlbypmvalvunxwkt.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "300mb",
    },
  },
};

export default nextConfig;
