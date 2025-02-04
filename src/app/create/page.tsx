'use client';

import { AvatarCreator, AvatarCreatorConfig, AvatarExportedEvent } from '@readyplayerme/react-avatar-creator';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Scene3D } from '@/components/Scene3D';
import { ChatProvider } from '@/hooks/useChat';
import { UI } from '@/components/UI';
import { useAvatar, AvatarProvider } from '@/hooks/useAvatar';
import { Button } from '@/components/ui/button';
import { SDKConfigPanel } from '@/components/embed/SDKConfigPanel';
import { SDKConfig, DEFAULT_SDK_CONFIG } from '@/types/sdk';
import { Steps } from '@/components/ui/steps';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const PERSONALITY_OPTIONS = [
  { value: 'friendly', label: 'Friendly' },
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'energetic', label: 'Energetic' },
];

const CAMERA_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'closeup', label: 'Close Up' },
  { value: 'fullbody', label: 'Full Body' },
  { value: 'portrait', label: 'Portrait' },
];

const LIGHTING_OPTIONS = [
  { value: 'studio', label: 'Studio' },
  { value: 'natural', label: 'Natural' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'soft', label: 'Soft' },
];

const EXPORT_FORMAT_OPTIONS = [
  { value: 'glb', label: 'GLB Model' },
  { value: 'png', label: 'PNG Image' },
  { value: 'gif', label: 'Animated GIF' },
];

const config: AvatarCreatorConfig = {
  bodyType: (process.env.NEXT_PUBLIC_RPM_BODY_TYPE || 'fullbody') as 'fullbody' | 'halfbody',
  quickStart: true, // Force quick start to skip signup
  language: 'en',
  clearCache: true, // Clear cache to ensure fresh start
};

export default function CreateAvatar() {
  const router = useRouter();
  //@ts-ignore
  const { refreshAvatar } = useAvatar();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [showAvatarCreator, setShowAvatarCreator] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [sdkConfig, setSDKConfig] = useState<SDKConfig>(DEFAULT_SDK_CONFIG);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState('glb');
  const [message, setMessage] = useState('');

  // Generate a unique ID for the model
  const generateModelId = () => {
    return `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSDKConfigChange = (key: keyof SDKConfig, value: string) => {
    setSDKConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleOnAvatarExported = async (event: AvatarExportedEvent) => {
    let url = event.data?.url;
    if (url) {
      url = `${url}?morphTargets=mouthSmile,ARKit`;
      setIsLoading(true);
      
      try {
        setLoadingStatus('Downloading avatar model...');
        const response = await fetch(url);
        const blob = await response.blob();
        
        setLoadingStatus('Processing avatar...');
        const modelId = generateModelId();
        
        const formData = new FormData();
        formData.append('file', blob, `${modelId}.glb`);
        formData.append('originalUrl', url);
        formData.append('modelId', modelId);
        formData.append('sdkConfig', JSON.stringify(sdkConfig));
        
        const uploadResponse = await fetch('/api/avatar', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to save avatar: ${await uploadResponse.text()}`);
        }

        const data = await uploadResponse.json();
        setAvatarUrl(url);
        setLoadingStatus('Preparing preview...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCurrentStep(1); // Move to next step after avatar creation
        setIsLoading(false);
        setLoadingStatus('');
        
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

  const handleExport = async (format: string) => {
    try {
      setIsLoading(true);
      setLoadingStatus(`Exporting as ${format.toUpperCase()}...`);

      // Add format-specific export logic here
      switch (format) {
        case 'glb':
          const a = document.createElement('a');
          a.href = avatarUrl;
          a.download = 'avatar.glb';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          break;
        case 'png':
          // Add PNG export logic
          await fetch('/api/export/png', {
            method: 'POST',
            body: JSON.stringify({ avatarUrl, modelId: generateModelId() }),
          });
          break;
        case 'gif':
          // Add GIF export logic
          await fetch('/api/export/gif', {
            method: 'POST',
            body: JSON.stringify({ avatarUrl, modelId: generateModelId() }),
          });
          break;
      }

      setIsLoading(false);
      setLoadingStatus('');
    } catch (error) {
      console.error('Export error:', error);
      setLoadingStatus('Export failed. Please try again.');
      setTimeout(() => {
        setIsLoading(false);
        setLoadingStatus('');
      }, 3000);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message, 
          modelId: generateModelId(),
          voiceId: sdkConfig.voiceId,
          personality: sdkConfig.personality
        }),
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      // Clear the input after successful send
      setMessage('');
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  const steps = [
    {
      title: 'Create Avatar',
      description: 'Design your avatar using the Ready Player Me creator',
      content: (
        <div className="w-full aspect-square max-h-[calc(100vh-300px)]">
          <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden [&_.rpm-header]:hidden [&_.rpm-navigation]:hidden">
            <style jsx global>{`
              :root {
                --rpm-primary-color: #3B82F6 !important;
                --rpm-background-color: #111827 !important;
                --rpm-text-color: #FFFFFF !important;
              }
            `}</style>
            <AvatarCreator
              subdomain="aditya-6ktkl6"
              config={config}
              onAvatarExported={handleOnAvatarExported}
              className="w-full h-full"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Configure Settings',
      description: 'Customize your avatar settings',
      content: (
        <div className="grid grid-cols-[1fr,1fr] gap-6 h-[calc(100vh-300px)]">
          {/* Left side - Model Preview */}
          <Card className="relative overflow-hidden">
            {avatarUrl && (
              <div className="relative w-full h-full">
                <ChatProvider>
                  <AvatarProvider>
                    <Scene3D
                      key={`preview-${avatarUrl}`}
                      initialModelPath={avatarUrl}
                      isCreateRoute={true}
                    />
                    <UI />
                  </AvatarProvider>
                </ChatProvider>
              </div>
            )}
          </Card>

          {/* Right side - Configuration */}
          <Card className="p-6 overflow-y-auto bg-[#1a1a1a]/80">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Avatar Settings
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Voice ID</Label>
                  <Input
                    value={sdkConfig.voiceId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSDKConfigChange('voiceId', e.target.value)}
                    placeholder="Enter voice ID"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Voice ID will be used for the avatar's speech
                  </p>
                </div>
                
                <div>
                  <Label>Personality</Label>
                  <Select
                    value={sdkConfig.personality}
                    onValueChange={(value: string) => handleSDKConfigChange('personality', value)}
                    options={PERSONALITY_OPTIONS}
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Affects how the avatar responds and gestures
                  </p>
                </div>

                <div>
                  <Label>Camera Type</Label>
                  <Select
                    value={sdkConfig.cameraType}
                    onValueChange={(value: string) => handleSDKConfigChange('cameraType', value)}
                    options={CAMERA_OPTIONS}
                  />
                </div>

                <div>
                  <Label>Background Image URL</Label>
                  <Input
                    value={sdkConfig.backgroundImage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSDKConfigChange('backgroundImage', e.target.value)}
                    placeholder="Enter background image URL"
                  />
                </div>

                <div>
                  <Label>Lighting Type</Label>
                  <Select
                    value={sdkConfig.lightingType}
                    onValueChange={(value: string) => handleSDKConfigChange('lightingType', value)}
                    options={LIGHTING_OPTIONS}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      title: 'Preview',
      description: 'Preview and finalize your avatar',
      content: avatarUrl ? (
        <div className="grid grid-cols-[1.5fr,1fr] gap-6 h-[calc(100vh-300px)]">
          <Card className="relative overflow-hidden">
            <div className="relative w-full h-full">
              <ChatProvider>
                <AvatarProvider>
                  <Scene3D 
                    key={avatarUrl} 
                    initialModelPath={avatarUrl} 
                    isCreateRoute={true}
                  />
                  <UI />
                </AvatarProvider>
              </ChatProvider>
            </div>
          </Card>

          <div className="space-y-6 flex flex-col">
            <Card className="p-6 bg-[#1a1a1a]/80">
              <div className="space-y-4">
                <div>
                  <Label>Export Format</Label>
                  <Select
                    value={selectedFormat}
                    onValueChange={setSelectedFormat}
                    options={EXPORT_FORMAT_OPTIONS}
                  />
                </div>
                <Button
                  onClick={() => handleExport(selectedFormat)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Export
                </Button>
                <Button
                  onClick={() => router.push(`/embed?modelId=${generateModelId()}`)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  Embed
                </Button>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[calc(100vh-300px)]">
          <p className="text-gray-500">Please complete the previous steps first</p>
        </div>
      ),
    },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Steps
          steps={steps.map(step => ({ title: step.title, description: step.description }))}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
        
        <div className="mt-8">
          {steps[currentStep].content}
        </div>

        <div className="mt-8 flex justify-between">
          <Button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStep === steps.length - 1 || (currentStep === 0 && !avatarUrl)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
