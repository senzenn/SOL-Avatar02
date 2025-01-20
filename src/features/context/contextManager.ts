import { useStore } from '@/lib/store'
import { AIService } from '@/lib/ai-service'

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
  function_call?: {
    name: string
    arguments: string
  }
}

interface ContextState {
  messages: Message[]
  currentTopic?: string
  lastUpdated: Date
}

class ContextManager {
  private context: ContextState
  private ai: AIService

  constructor() {
    this.context = {
      messages: [],
      lastUpdated: new Date(),
    }
    this.ai = new AIService(
      process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
    )
  }

  async processInput(input: string): Promise<{
    text: string
    expressions?: string[]
    animation?: string
  }> {
    try {
      useStore.getState().setProcessingState(true)

      // Add user message to context
      this.context.messages.push({
        role: 'user',
        content: input,
      })

      // Process with OpenAI
      const response = await this.ai.createChatCompletion(this.context.messages)

      if (response) {
        this.context.messages.push(response)

        // Parse function call if present
        if (response.function_call) {
          const functionData = JSON.parse(response.function_call.arguments)
          return {
            text: functionData.text,
            expressions: functionData.expressions,
            animation: functionData.animation,
          }
        }

        return { text: response.content || '' }
      }

      throw new Error('No response from AI')
    } catch (error) {
      useStore.getState().setError(error instanceof Error ? error.message : 'Unknown error')
      throw error
    } finally {
      useStore.getState().setProcessingState(false)
    }
  }

  clearContext() {
    this.context = {
      messages: [],
      lastUpdated: new Date(),
    }
  }

  getContext(): ContextState {
    return { ...this.context }
  }
}

export const contextManager = new ContextManager() 