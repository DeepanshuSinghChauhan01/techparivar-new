import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Prisma's native query engine binary must not be bundled by Next.js's
  // production build — without this it can get mishandled in the
  // serverless bundle and crash the first time a query actually runs,
  // even though the build itself succeeds and local dev is unaffected.
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    // Default Server Action body size limit (1MB) is too small for file
    // uploads. Capped at 25MB — comfortably above the 20MB app-level file
    // size limit (src/lib/file-security.ts) to allow for multipart overhead.
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  images: {
    // Add remote domains here once product/case-study photography is hosted
    // externally (e.g. a CDN or Sanity's image pipeline):
    // remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
