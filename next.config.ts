import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  images: {
    domains: ["assets.coingecko.com", "coin-images.coingecko.com"],
  },
};

export default nextConfig;
