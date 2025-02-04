export const elevenLabsConfig = {
  apiKey: typeof window === 'undefined' ? '' : (process.env.ELEVEN_LABS_API_KEY || ''),
  modelId: process.env.ELEVENLABS_MODEL_ID || 'eleven_turbo_v2',
  voiceId: process.env.ELEVEN_LABS_VOICE_ID || ''
};

export const hasElevenLabsApiKey = () => {
  if (typeof window === 'undefined') return true;
  return !!process.env.ELEVEN_LABS_API_KEY;
};

export const getElevenLabsApiKey = () => {
  if (typeof window === 'undefined') return '';
  if (!process.env.ELEVEN_LABS_API_KEY) {
    throw new Error('ElevenLabs API key is required');
  }
  return process.env.ELEVEN_LABS_API_KEY;
};