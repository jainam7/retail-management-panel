// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  appDir: true, // ✅ Top-level configuration
  typedRoutes: true, // ✅ Stable feature
};

export default nextConfig;
