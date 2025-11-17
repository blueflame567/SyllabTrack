import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable automatic redirects to prevent 307 on webhooks
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
};

export default nextConfig;