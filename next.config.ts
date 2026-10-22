import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  webpack: (config, { isServer }) => {
    // Only allow fs module on server-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
  output: "export",
  serverExternalPackages: ["gray-matter"],
  distDir: "dist",
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
