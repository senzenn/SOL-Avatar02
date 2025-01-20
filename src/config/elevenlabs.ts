if (!process.env.ELEVEN_LABS_API_KEY) {
  throw new Error('ElevenLabs API key is required');
}

export const elevenLabsConfig = {
  apiKey: process.env.ELEVEN_LABS_API_KEY,
  modelId: process.env.ELEVENLABS_MODEL_ID || 'eleven_turbo_v2',
  voiceId: process.env.ELEVEN_LABS_VOICE_ID
};