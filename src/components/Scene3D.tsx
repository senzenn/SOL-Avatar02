'use client';

import { Canvas } from '@react-three/fiber';
import { Loader, useGLTF } from '@react-three/drei';
import { Experience } from './Experience';
import { useAvatar } from '@/hooks/useAvatar';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from 'next/navigation';

// RPM SDK ConfigurationRetired. She'd boost. She'd boost. 
const rpmConfig = {
  clearCache: true,
  bodyType: 'fullbody',
  quickStart: true,
  hideMenu: true,
  language: 'en',
  // Remove login elements
  authentication: {
    required: false,
    hideSignup: true,
    hideLogin: true
  }
};

export function Scene3D({ initialModelPath, isCreateRoute = false }: { initialModelPath?: string; isCreateRoute?: boolean }) {
  const router = useRouter();
  const { avatarData, isLoading, error, setAvatarData } = useAvatar();
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState<'initializing' | 'loading' | 'finalizing'>('initializing');
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle model loading
  useEffect(() => {
    if (initialModelPath) {
      console.log('Loading model:', initialModelPath);
      setPreviewUrl(initialModelPath);
      setShowDownloadOptions(true);
      
      // Preload the model
      useGLTF.preload(initialModelPath);
    }
  }, [initialModelPath]);

  // Handle avatar creation with preview
  const handleCreateAvatar = () => {
    const subdomain = 'demo';
    const frame = document.createElement('iframe');
    frame.id = 'rpm-frame';
    frame.style.width = '100%';
    frame.style.height = '100%';
    frame.style.border = 'none';
    frame.style.position = 'fixed';
    frame.style.top = '0';
    frame.style.left = '0';
    frame.style.zIndex = '9999';
    
    frame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi&config=${encodeURIComponent(JSON.stringify(rpmConfig))}`;
    document.body.appendChild(frame);

    window.addEventListener('message', async function handleMessage(event) {
      if (event.data.type === 'v1.avatar.exported') {
        const avatarUrl = event.data.data.url;
        document.body.removeChild(frame);
        window.removeEventListener('message', handleMessage);
        
        // Update preview URL first
        setPreviewUrl(avatarUrl);
        // Then update avatar data
        setAvatarData({ modelPath: avatarUrl });
        setShowDownloadOptions(true);
        
        // Preload the model
        useGLTF.preload(avatarUrl);
      }
    });
  };

  // Handle GLB download
  const handleDownloadGLB = async () => {
    if (!avatarData?.modelPath) return;
    
    try {
      const response = await fetch(avatarData.modelPath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'avatar.glb';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading GLB:', error);
    }
  };

  // Reset preview
  const handleResetAvatar = () => {
    setPreviewUrl(null);
    setAvatarData(null);
    setShowDownloadOptions(false);
  };

  // Enhanced GSAP animations
  useEffect(() => {
    const tl = gsap.timeline();
    
    if (containerRef.current) {
      tl.fromTo(containerRef.current,
        { 
          opacity: 0,
          scale: 0.95,
          filter: 'blur(10px)',
          y: 20
        },
        { 
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1.4,
          ease: "power4.out"
        }
      );
    }
  }, []);

  // Enhanced loading animation
  useEffect(() => {
    if (isLoading) {
      setLoadingPhase('initializing');
      
      // Initial delay for setup phase
      setTimeout(() => {
        setLoadingPhase('loading');
        
        // Simulate loading progress with varying speeds
        const interval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval);
              setLoadingPhase('finalizing');
              return prev;
            }
            // Variable progress speed
            const speed = prev < 30 ? 10 : prev < 60 ? 5 : 2;
            return prev + Math.random() * speed;
          });
        }, 200);

        return () => clearInterval(interval);
      }, 800);
    } else {
      // Smooth completion
      gsap.to(progressRef.current, {
        width: '100%',
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          setLoadingProgress(100);
          setLoadingPhase('finalizing');
        }
      });
    }
  }, [isLoading]);

  // Preload the model
  useEffect(() => {
    if (avatarData?.modelPath) {
      useGLTF.preload(avatarData.modelPath);
    }
  }, [avatarData?.modelPath]);

  // Preview canvas component
  const PreviewCanvas = ({ url }: { url: string }) => (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 45 }}
      className="transition-all duration-500"
    >
      <Experience modelPath={url} />
    </Canvas>
  );

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-pulse" />
              <div 
                className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin"
                style={{ animationDuration: '1s' }}
              />
              <div 
                className="absolute inset-0 rounded-full border-4 border-blue-500/10 animate-ping"
                style={{ animationDuration: '2s' }}
              />
            </div>
            <h2 className="text-2xl font-medium text-white/90 animate-pulse">
              {loadingPhase === 'initializing' ? 'Initializing...' :
               loadingPhase === 'loading' ? 'Loading Avatar' :
               'Finalizing...'}
            </h2>
            <p className="text-gray-400 transition-all duration-300">
              {loadingPhase === 'initializing' ? 'Setting up the environment...' :
               loadingPhase === 'loading' ? 'Preparing your experience...' :
               'Almost ready...'}
            </p>
          </div>
          <div className="relative">
            <Progress 
              value={loadingProgress} 
              className="h-1.5 bg-gray-800 overflow-hidden"
            />
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500/20 animate-pulse"
              style={{ 
                width: `${loadingProgress}%`,
                transition: 'width 0.3s ease-out'
              }} 
            />
            <div className="mt-2 text-right text-sm text-gray-500 transition-all duration-300">
              {Math.round(loadingProgress)}%
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl bg-black/50 backdrop-blur-xl border border-red-500/10 transform hover:scale-105 transition-all duration-300">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto text-red-500 animate-bounce-slow">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-white">Unable to Load Avatar</h2>
            <p className="text-gray-400">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="destructive"
              className="mt-4 w-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Updated preview/create view
  if (!avatarData && !previewUrl) {
    return (
      <div className="h-screen w-full bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl bg-black/50 backdrop-blur-xl border border-yellow-500/10 transform hover:scale-105 transition-all duration-300">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 mx-auto text-yellow-500 animate-float">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-white">Create Your Avatar</h2>
            <p className="text-gray-400">Design and preview your custom avatar</p>
            <Button 
              onClick={handleCreateAvatar}
              variant="outline"
              className="mt-4 w-full border-yellow-500/20 hover:bg-yellow-500/10"
            >
              Create Avatar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show preview or final avatar
  return (
    <div ref={containerRef} className="relative h-screen w-full bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none z-10" />
      
      {/* Controls  create new avatar and download glb file button removed because they were looking shit in ui */}
     

      {/* Preview Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 45 }}
        className="transition-all duration-500"
      >
        <Experience 
          key={previewUrl || avatarData?.modelPath} 
          modelPath={previewUrl || avatarData?.modelPath} 
          currentAnimation="Idle"
          isCreateRoute={isCreateRoute}
        />
      </Canvas>
      <Loader />
    </div>
  );
} 