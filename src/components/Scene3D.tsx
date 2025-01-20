'use client';

import { Canvas } from '@react-three/fiber';
import { Loader, useGLTF } from '@react-three/drei';
import { Experience } from './Experience';
import { useAvatar } from '@/hooks/useAvatar';
import { useEffect } from 'react';

export function Scene3D() {
  const { avatarData, isLoading, error } = useAvatar();

  console.log('🎭 Scene3D - Avatar Data:', avatarData);
  console.log('⏳ Scene3D - Loading:', isLoading);
  console.log('❌ Scene3D - Error:', error);

  // Preload the model
  useEffect(() => {
    if (avatarData?.modelPath) {
      console.log('🔄 Scene3D - Preloading model:', avatarData.modelPath);
      useGLTF.preload(avatarData.modelPath);
    }
  }, [avatarData?.modelPath]);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading avatar...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-red-500 text-2xl">Error loading avatar: {error}</div>
      </div>
    );
  }

  if (!avatarData) {
    console.error('❌ Scene3D - No avatar data available');
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white text-2xl">No avatar found. Please create one first.</div>
      </div>
    );
  }

  console.log('✅ Scene3D - Rendering canvas with avatar:', avatarData.modelPath);
  return (
    <div className="h-screen w-full bg-black">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
        <Experience key={avatarData.modelPath} />
      </Canvas>
      <Loader />
    </div>
  );
} 