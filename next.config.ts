import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true, // enables PPR as default behavior — Next.js 16
};

export default nextConfig;
