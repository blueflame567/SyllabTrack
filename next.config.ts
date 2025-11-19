import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable automatic redirects to prevent 307 on webhooks
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ["@clerk/nextjs", "date-fns"],
  },
};

export default nextConfig;