import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Add remote domains here once product/case-study photography is hosted
    // externally (e.g. a CDN or Sanity's image pipeline):
    // remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
