import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Prisma's native query engine binary must not be bundled by Next.js's
  // production build — without this it can get mishandled in the
  // serverless bundle and crash the first time a query actually runs,
  // even though the build itself succeeds and local dev is unaffected.
  serverExternalPackages: ["@prisma/client"],
  images: {
    // Add remote domains here once product/case-study photography is hosted
    // externally (e.g. a CDN or Sanity's image pipeline):
    // remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
