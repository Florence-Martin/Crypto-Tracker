import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
