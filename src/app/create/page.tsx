'use client';

import { AvatarCreator, AvatarCreatorConfig, AvatarExportedEvent } from '@readyplayerme/react-avatar-creator';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Scene3D } from '@/components/Scene3D';
import { ChatProvider } from '@/hooks/useChat';
import { UI } from '@/components/UI';
import { useAvatar, AvatarProvider } from '@/hooks/useAvatar';
import { Button } from '@/components/ui/button';

export default function CreateAvatar() {
  const router = useRouter();
  //@ts-ignore
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
          throw new Error(`Failed to save avatar: ${await uploadResponse.text()}`);
        }

        const data = await uploadResponse.json();
        console.log('✅ Avatar saved successfully:', data);
        
        // Set the avatar URL first
        setAvatarUrl(url);
        
        // Update loading status and states
        setLoadingStatus('Preparing preview...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Switch to preview mode
        setShowAvatarCreator(false);
        setIsLoading(false);
        setLoadingStatus('');
        
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
        <div className="text-white text-2xl animate-pulse">
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
          <Button
            onClick={() => {
              const a = document.createElement('a');
              a.href = avatarUrl;
              a.download = 'avatar.glb';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Download GLB
          </Button>
          <Button
            onClick={() => router.push('/embed')}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Embed
          </Button>
          <Button
            onClick={() => {
              setShowAvatarCreator(true);
              setAvatarUrl('');
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            Create New
          </Button>
        </div>
        <ChatProvider>
          <AvatarProvider>
            <UI />
            <Scene3D key={avatarUrl} initialModelPath={avatarUrl} isCreateRoute={true} />
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
