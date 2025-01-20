"use client";

import { useSearchParams } from 'next/navigation';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { Suspense } from 'react';
import { useStore } from '@/lib/store';
import { useEffect } from 'react';

export default function PlayerPage() {
  const searchParams = useSearchParams();
  const { setAvatarModel } = useStore();
  
  const features = {
    chat: searchParams.get('chat') === 'true',
    lipSync: searchParams.get('lipSync') === 'true',
    animations: searchParams.get('animations') === 'true',
  };

  const modelPath = searchParams.get('modelPath');

  useEffect(() => {
    if (modelPath) {
      setAvatarModel(modelPath);
    }
  }, [modelPath, setAvatarModel]);

  if (!modelPath) {
    return (
      <div className="w-full h-full min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-red-500">No avatar model specified</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen bg-transparent">
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