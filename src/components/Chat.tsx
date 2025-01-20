import { useState } from 'react';
import { useChat } from '@/hooks/useChat';

interface MessageType {
  message: string;
}

interface ChatContextType {
  messages: MessageType[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
}

export default function Chat() {

  const [input, setInput] = useState('');
// @ts-ignore
  const { messages, isLoading, error, sendMessage }: ChatContextType = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 bg-black/50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 h-32 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className="text-white mb-2">
              {msg.message}
            </div>
          ))}
          {error && (
            <div className="text-red-500 mb-2">
              {error}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded bg-white/10 text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
} 