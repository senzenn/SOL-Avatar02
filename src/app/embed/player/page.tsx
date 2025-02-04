"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { AvatarDisplay } from '@/components/AvatarDisplay';

// Add these exports back with proper configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PlayerPage() {
  const searchParams = useSearchParams();
  const { setAvatarModel } = useStore();
  const [hasApiKey, setHasApiKey] = useState(false);
  
  useEffect(() => {
    // Check for API key only on client side
    const apiKey = process.env.ELEVEN_LABS_API_KEY;
    setHasApiKey(!!apiKey);
  }, []);

  const features = {
    chat: searchParams?.get('chat') === 'true',
    lipSync: searchParams?.get('lipSync') === 'true' && hasApiKey,
    animations: searchParams?.get('animations') === 'true',
  };

  const modelPath = searchParams?.get('modelPath');

  useEffect(() => {
    if (modelPath) {
      setAvatarModel(modelPath);
    }
  }, [modelPath, setAvatarModel]);

  if (!modelPath) {
    return (
      <div className="w-full h-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500">No avatar model specified</div>
      </div>
    );
  }

  if (!hasApiKey) {
    console.warn('ElevenLabs API key is missing - lip sync feature will be disabled');
  }

  return (
    <div className="w-full h-full min-h-screen bg-black">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <div className="w-full h-full absolute inset-0">
          <AvatarDisplay 
            className="w-full h-full" 
            features={features}
          />
        </div>
      </Suspense>
    </div>
  );
} 