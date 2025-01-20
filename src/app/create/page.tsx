'use client';

import { AvatarCreator, AvatarCreatorConfig, AvatarExportedEvent } from '@readyplayerme/react-avatar-creator';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Scene3D } from '@/components/Scene3D';
import { ChatProvider } from '@/hooks/useChat';
import { UI } from '@/components/UI';
import { useAvatar, AvatarProvider } from '@/hooks/useAvatar';

export default function CreateAvatar() {
  const router = useRouter();
  const { refreshAvatar } = useAvatar();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [showAvatarCreator, setShowAvatarCreator] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');

  // Generate a unique ID for the model
  const generateModelId = () => {
    return `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const config: AvatarCreatorConfig = {
    clearCache: process.env.NEXT_PUBLIC_RPM_CLEAR_CACHE === 'true',
    bodyType: (process.env.NEXT_PUBLIC_RPM_BODY_TYPE || 'fullbody') as 'fullbody' | 'halfbody',
    quickStart: process.env.NEXT_PUBLIC_RPM_QUICK_START === 'true',
    language: 'en',
  };

  const handleOnAvatarExported = async (event: AvatarExportedEvent) => {
    let url = event.data?.url;
    if (url) {
      // Add morphTargets to the URL
      url = `${url}?morphTargets=mouthSmile,ARKit`;
      setIsLoading(true);
      console.log('🎯 Starting avatar creation process...');
      console.log('📝 Avatar URL:', url);
      console.log('⚙️ Config:', config);
      
      try {
        setLoadingStatus('Downloading avatar model...');
        // Download the GLB file
        const response = await fetch(url);
        const blob = await response.blob();
        console.log('✅ Avatar model downloaded, size:', blob.size);
        
        setLoadingStatus('Processing avatar...');
        // Generate unique model ID
        const modelId = generateModelId();
        console.log('🆔 Generated model ID:', modelId);
        
        // Create form data
        const formData = new FormData();
        formData.append('file', blob, `${modelId}.glb`);
        formData.append('originalUrl', url);
        formData.append('modelId', modelId);
        
        // Upload to our API
        console.log('📤 Uploading avatar to API...');
        const uploadResponse = await fetch('/api/avatar', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('❌ Upload failed:', errorText);
          throw new Error(`Failed to save avatar: ${errorText}`);
        }

        const data = await uploadResponse.json();
        console.log('✅ Avatar saved successfully:', data);
        setAvatarUrl(data.avatar.modelPath);
        
        setLoadingStatus('Preparing avatar preview...');
        // Add a delay to ensure the file is written and accessible
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('⏳ File write delay completed');
        
        setLoadingStatus('Refreshing avatar data...');
        // Refresh avatar data in context and wait for it to complete
        await refreshAvatar();
        console.log('🔄 Avatar data refreshed');
        
        // Add another small delay to ensure the avatar data is loaded in the context
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verify that avatar data is loaded
        const verifyResponse = await fetch('/api/avatar');
        const avatars = await verifyResponse.json();
        console.log('📚 All avatars:', avatars);
        const latestAvatar = avatars[avatars.length - 1];
        
        if (!latestAvatar || !latestAvatar.modelPath) {
          console.error('❌ No avatar data found after creation');
          throw new Error('Avatar data not found after creation');
        }
        console.log('✅ Avatar data verified:', latestAvatar);

        // Set loading states
        setLoadingStatus('');
        setIsLoading(false);
        setShowAvatarCreator(false);

        // Show success message
        console.log('🎉 Avatar creation completed successfully!');
      } catch (error) {
        console.error('❌ Error processing avatar:', error);
        setLoadingStatus('Error: Failed to save avatar. Please try again.');
        setTimeout(() => {
          setIsLoading(false);
          setLoadingStatus('');
        }, 3000);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-white text-2xl">
          {loadingStatus || 'Loading...'}
        </div>
        <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-progress"></div>
        </div>
      </div>
    );
  }

  if (!showAvatarCreator && avatarUrl) {
    console.log('🎨 Rendering avatar preview with URL:', avatarUrl);
    return (
      <div className="h-screen w-full bg-black relative">
        <div className="absolute top-4 right-4 z-10 flex gap-4">
          <button
            onClick={() => setShowAvatarCreator(true)}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Edit Avatar
          </button>
          <button
            onClick={() => router.push('/embed')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Embed
          </button>
        </div>
        <div className="absolute top-4 left-4 z-10">
          <div className="text-white text-sm">
            Model Path: {avatarUrl}
          </div>
        </div>
        <ChatProvider>
          <AvatarProvider>
            <UI />
            <Scene3D key={avatarUrl} />
          </AvatarProvider>
        </ChatProvider>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <style jsx global>{`
        /* Hide the Ready Player Me header and navigation */
        .rpm-header,
        .rpm-navigation {
          display: none !important;
        }
      `}</style>
      <AvatarCreator
        subdomain="aditya-6ktkl6"
        config={config}
        onAvatarExported={handleOnAvatarExported}
        className="w-full h-full"
      />
    </div>
  );
}
