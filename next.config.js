/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ELEVENLABS_API_KEY: process.env.ELEVEN_LABS_API_KEY,
    ELEVENLABS_MODEL_ID: process.env.ELEVENLABS_MODEL_ID,
    ELEVENLABS_VOICE_ID: process.env.ELEVEN_LABS_VOICE_ID
  },
  // ... other config options

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },  
};

module.exports = nextConfig;