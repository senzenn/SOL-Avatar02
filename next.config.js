/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    ELEVEN_LABS_API_KEY: process.env.ELEVEN_LABS_API_KEY,
    ELEVEN_LABS_VOICE_ID: process.env.ELEVEN_LABS_VOICE_ID,
    ELEVENLABS_MODEL_ID: process.env.ELEVENLABS_MODEL_ID,
  },
  // Remove serverRuntimeConfig and publicRuntimeConfig as they're not needed
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during builds
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during builds
  },
  // Configure the /embed/player page to be generated at runtime
  experimental: {
    appDir: true,
  },
  // Configure page build settings
  output: 'standalone',
  // Disable static optimization for specific pages
  unstable_runtimeJS: true,
};

module.exports = nextConfig;