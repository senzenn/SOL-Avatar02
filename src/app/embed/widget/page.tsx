'use client';

import { useSearchParams } from 'next/navigation';
import { Scene3D } from '@/components/Scene3D';
import { ChatProvider } from '@/hooks/useChat';
import { AvatarProvider } from '@/hooks/useAvatar';
import { useChat } from '@/hooks/useChat';
import { useState, useEffect } from 'react';

export default function WidgetPage() {
  const searchParams = useSearchParams();
  const modelId = searchParams?.get('modelId');
  const size = searchParams?.get('size') || 'medium';
  
  if (!modelId) {
    return (
      <div className="flex items-center justify-center h-full bg-[#050505] text-white">
        <p>No model ID provided</p>
      </div>
    );
  }

  return (
    <ChatProvider>
      <AvatarProvider>
        <WidgetContent modelId={modelId} size={size} />
      </AvatarProvider>
    </ChatProvider>
  );
}

function WidgetContent({ modelId, size }: { modelId: string; size: string }) {
  const [message, setMessage] = useState('');
  const { chat, isLoading } = useChat();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage('');
    await chat(userMessage);
  };

  const containerStyle = {
    height: size === 'small' ? '400px' :
           size === 'medium' ? '600px' :
           size === 'large' ? '800px' : '100vh'
  };

  return (
    <div className="relative w-full h-full bg-[#050505] flex flex-col" style={containerStyle}>
      <div className="flex-1 relative">
        <Scene3D
          initialModelPath={`/api/model/${modelId}`}
          isCreateRoute={false}
          modelScale={isMobile ? 1.5 : 1.2}
          cameraDistance={isMobile ? 2.5 : 2}
          hideUI={true}
          backgroundColor="#050505"
          disableLighting={true}
          ambientLightIntensity={0}
          directionalLightIntensity={0}
        />
      </div>
      
      <div className="w-full px-4 py-3 sm:p-4 bg-[#111111]/90 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#1A1A1A] text-white rounded-lg px-3 py-2 sm:px-4 text-sm border border-gray-800 focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading}
            className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
} 