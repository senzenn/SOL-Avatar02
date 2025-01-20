declare module 'elevenlabs-node' {
  const voice: {
    textToSpeech: (apiKey: string, voiceId: string, fileName: string, text: string) => Promise<void>;
    getVoices: (apiKey: string) => Promise<any>;
  };
  export default voice;
} 