/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during builds
  },
  // Add any additional configuration options here
};

export default nextConfig;
// 