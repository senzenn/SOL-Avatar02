import { useState, useCallback, useRef, useEffect } from 'react'
import { useStore } from '@/lib/store'
import { contextManager } from '@/features/context/contextManager'
import { multiModalGenerator } from '@/features/multimodal/generator'

interface AvatarResponse {
  isLoading: boolean
  error: string | null
  speak: (text: string) => Promise<void>
  processUserInput: (input: string) => Promise<void>
  stopSpeaking: () => void
}

export function useAvatarInteraction(): AvatarResponse {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const {
    avatar: { voiceSettings },
    setError: setGlobalError,
  } = useStore()

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }
    }
  }, [])

  const speak = useCallback(async (text: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { audioUrl, expressionTimeline, animationData } = await multiModalGenerator.generate({
        text,
        voiceSettings,
      })

      // Create and play audio
      if (audioRef.current) {
        audioRef.current.pause()
        URL.revokeObjectURL(audioRef.current.src)
      }

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      // Handle expressions and animations
      audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime * 1000 // Convert to ms
        const currentExpression = expressionTimeline.find(
          (exp) => exp.timestamp <= currentTime && exp.timestamp + 1000 > currentTime
        )

        if (currentExpression) {
          // Update avatar expression
          // This would be implemented based on your avatar system
        }
      })

      await audio.play()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate speech'
      setError(errorMessage)
      setGlobalError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [voiceSettings, setGlobalError])

  const processUserInput = useCallback(async (input: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await contextManager.processInput(input)
      await speak(response.text)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process input'
      setError(errorMessage)
      setGlobalError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [speak, setGlobalError])

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [])

  return {
    isLoading,
    error,
    speak,
    processUserInput,
    stopSpeaking,
  }
} 