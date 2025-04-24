/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { dev, isServer }) => {
    // Disable webpack cache completely to prevent ENOENT errors
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
