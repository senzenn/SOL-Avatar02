interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style: number;
  speakerBoost: boolean;
}

interface VoiceGenerationOptions {
  text: string;
  voiceId: string;
  modelId?: string;
  voiceSettings?: VoiceSettings;
}

export class VoiceService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('ElevenLabs API key is required');
    }
    this.apiKey = apiKey;
  }

  async textToSpeech({
    text,
    voiceId,
    modelId = 'eleven_monolingual_v1',
    voiceSettings = {
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.5,
      speakerBoost: true,
    },
  }: VoiceGenerationOptions): Promise<Blob> {
    if (!voiceId) {
      throw new Error('Voice ID is required for text-to-speech');
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: modelId,
            voice_settings: {
              stability: voiceSettings.stability,
              similarity_boost: voiceSettings.similarityBoost,
              style: voiceSettings.style,
              speaker_boost: voiceSettings.speakerBoost,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || `Failed to generate speech: ${response.statusText}`);
      }

      return response.blob();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to generate speech');
    }
  }

  // Voice IDs for different genders
  static getVoiceId(gender: 'male' | 'female' = 'male'): string {
    // Replace these with your actual ElevenLabs voice IDs
    return gender === 'male' 
      ? process.env.NEXT_PUBLIC_ELEVENLABS_MALE_VOICE_ID || 'default-male-voice-id'
      : process.env.NEXT_PUBLIC_ELEVENLABS_FEMALE_VOICE_ID || 'default-female-voice-id';
  }
} 