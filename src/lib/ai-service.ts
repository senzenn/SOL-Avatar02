interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
  function_call?: {
    name: string;
    arguments: string;
  };
}

interface ChatCompletionResponse {
  choices: Array<{
    message: Message;
  }>;
}

export class AIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createChatCompletion(messages: Message[]): Promise<Message> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages,
        functions: [
          {
            name: 'updateAvatar',
            parameters: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                expressions: {
                  type: 'array',
                  items: { type: 'string' },
                },
                animation: { type: 'string' },
              },
              required: ['text'],
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(error.error?.message || 'Failed to generate response');
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0]?.message || { role: 'assistant', content: 'No response generated' };
  }
} 