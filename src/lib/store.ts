import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UserState {
  profile: {
    id: string
    name: string
    preferences: {
      theme: 'light' | 'dark'
      voiceId?: string
      modelId?: string
    }
  } | null
  subscription: {
    status: 'free' | 'premium' | 'enterprise'
    expiresAt: string
  } | null
}

interface AvatarState {
  currentModel: string
  latestCreatedModel: string | null
  expressions: string[]
  animations: string[]
  voiceSettings: {
    gender: 'male' | 'female'
    voiceId: string
    pitch: number
    speed: number
  }
}

interface AppState extends UserState {
  avatar: AvatarState
  isProcessing: boolean
  error: string | null
  setProfile: (profile: UserState['profile']) => void
  setSubscription: (subscription: UserState['subscription']) => void
  setAvatarModel: (modelId: string) => void
  setLatestCreatedModel: (modelId: string) => void
  setVoiceSettings: (settings: Partial<AvatarState['voiceSettings']>) => void
  setProcessingState: (isProcessing: boolean) => void
  setError: (error: string | null) => void
}

// Default voice IDs - replace these with your actual ElevenLabs voice IDs
const DEFAULT_VOICE_IDS = {
  male: process.env.NEXT_PUBLIC_ELEVENLABS_MALE_VOICE_ID || '',
  female: process.env.NEXT_PUBLIC_ELEVENLABS_FEMALE_VOICE_ID || '',
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        profile: null,
        subscription: null,
        avatar: {
          currentModel: '/models/default-avatar.glb', // Default fallback model
          latestCreatedModel: null,
          expressions: [],
          animations: [],
          voiceSettings: {
            gender: 'male',
            voiceId: DEFAULT_VOICE_IDS.male,
            pitch: 1,
            speed: 1,
          },
        },
        isProcessing: false,
        error: null,

        // Actions
        setProfile: (profile) => set({ profile }),
        setSubscription: (subscription) => set({ subscription }),
        setAvatarModel: (modelId) =>
          set((state) => ({
            avatar: { ...state.avatar, currentModel: modelId },
          })),
        setLatestCreatedModel: (modelId) =>
          set((state) => ({
            avatar: { 
              ...state.avatar, 
              latestCreatedModel: modelId,
              currentModel: modelId, // Also update current model
            },
          })),
        setVoiceSettings: (settings) =>
          set((state) => ({
            avatar: {
              ...state.avatar,
              voiceSettings: {
                ...state.avatar.voiceSettings,
                ...settings,
                // Update voiceId if gender changes
                voiceId: settings.gender 
                  ? DEFAULT_VOICE_IDS[settings.gender]
                  : state.avatar.voiceSettings.voiceId,
              },
            },
          })),
        setProcessingState: (isProcessing) => set({ isProcessing }),
        setError: (error) => set({ error }),
      }),
      {
        name: 'sol-avatar-storage',
      }
    )
  )
) 