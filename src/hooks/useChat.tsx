"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

interface Message {
  text: string;
  audio: string;
  lipsync: {
    mouthCues: Array<{
      start: number;
      end: number;
      value: string;
    }>;
  };
  facialExpression: 'smile' | 'sad' | 'angry' | 'surprised' | 'funnyFace' | 'default';
  animation: 'Talking_0' | 'Talking_1' | 'Talking_2' | 'Crying' | 'Laughing' | 'Rumba' | 'Idle' | 'Terrified' | 'Angry';
  time?: string;
}

interface ChatContextType {
  chat: (message: string) => Promise<void>;
  message: Message | null;
  onMessagePlayed: () => void;
  loading: boolean;
  cameraZoomed: boolean;
  setCameraZoomed: (zoomed: boolean) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  const chat = useCallback(async (message: string) => {
    try {
      console.log('🚀 Starting chat process...');
      console.log('📝 Message:', message);
      setLoading(true);
      
      console.log('🌐 Making API request to /api/chat...');
      const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
        cache: 'no-store'
      });

      if (!response.ok) {
        console.error('❌ API request failed:', response.status, response.statusText);
        throw new Error('Failed to fetch response');
      }

      console.log('✅ API request successful');
      const data = await response.json();
      console.log('📦 Received data:', data);
      
      if (data.error) {
        console.error("❌ Chat error:", data.error);
        return;
      }

      if (Array.isArray(data.messages)) {
        console.log('🎯 Processing messages...');
        const messagesWithTime = data.messages.map((msg: Message) => ({
          ...msg,
          time: formatTime(),
        }));
        console.log('⏰ Messages with timestamps:', messagesWithTime);
        setMessages((prevMessages) => [...prevMessages, ...messagesWithTime]);
      } else {
        console.error("❌ Invalid response format:", data);
      }
    } catch (error) {
      console.error("❌ Chat error:", error);
    } finally {
      console.log('🏁 Chat process completed');
      setLoading(false);
    }
  }, []);

  const onMessagePlayed = useCallback(() => {
    console.log('🎵 Message played, removing from queue');
    setMessages((prevMessages) => prevMessages.slice(1));
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  const contextValue = useMemo(() => ({
    chat,
    message,
    onMessagePlayed,
    loading,
    cameraZoomed,
    setCameraZoomed,
  }), [chat, message, onMessagePlayed, loading, cameraZoomed, setCameraZoomed]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
