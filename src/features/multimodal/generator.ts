import { useStore } from '@/lib/store'
import { VoiceService } from '@/lib/voice-service'

interface GenerationOptions {
  text: string
  expressions?: string[]
  animation?: string
  voiceSettings?: {
    gender?: 'male' | 'female'
    voiceId?: string
    pitch?: number
    speed?: number
  }
}

class MultiModalGenerator {
  private voiceService: VoiceService
  
  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
    if (!apiKey) {
      throw new Error('ElevenLabs API key is required')
    }
    this.voiceService = new VoiceService(apiKey)
  }

  async generate({
    text,
    expressions = [],
    animation,
    voiceSettings,
  }: GenerationOptions): Promise<{
    audioUrl: string
    expressionTimeline: Array<{ expression: string; timestamp: number }>
    animationData?: any
  }> {
    try {
      useStore.getState().setProcessingState(true)

      // Get current voice settings from store
      const storeVoiceSettings = useStore.getState().avatar.voiceSettings

      // Generate voice
      const audioBlob = await this.voiceService.textToSpeech({
        text,
        voiceId: voiceSettings?.voiceId || storeVoiceSettings.voiceId,
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.75,
          style: 0.5,
          speakerBoost: true,
        },
      })

      // Create a blob URL for the audio
      const audioUrl = URL.createObjectURL(audioBlob)

      // Generate expression timeline
      const expressionTimeline = this.generateExpressionTimeline(expressions, text.length)

      // Process animation if provided
      const animationData = animation ? await this.processAnimation(animation) : undefined

      return {
        audioUrl,
        expressionTimeline,
        animationData,
      }
    } catch (error) {
      useStore.getState().setError(error instanceof Error ? error.message : 'Unknown error')
      throw error
    } finally {
      useStore.getState().setProcessingState(false)
    }
  }

  private generateExpressionTimeline(
    expressions: string[],
    textLength: number
  ): Array<{ expression: string; timestamp: number }> {
    const timeline: Array<{ expression: string; timestamp: number }> = []
    const avgDuration = 1000 // Average duration per expression in ms

    expressions.forEach((expression, index) => {
      timeline.push({
        expression,
        timestamp: index * avgDuration,
      })
    })

    return timeline
  }

  private async processAnimation(animationName: string): Promise<any> {
    // Implementation for processing animations
    // This would load and process animation data from your animation system
    return {}
  }
}

export const multiModalGenerator = new MultiModalGenerator() 