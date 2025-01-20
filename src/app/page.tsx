"use client";

import { Scene3D } from "@/components/Scene3D";
import { UI } from "@/components/UI";
import { ChatProvider } from "@/hooks/useChat";
import { AvatarProvider, useAvatar } from "@/hooks/useAvatar";

function HomeContent() {
  const { isLoading, error, avatarData } = useAvatar();

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading avatar...</div>
      </div>
    );
  }

  if (error || !avatarData) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center flex-col gap-4">
        <div className="text-white text-2xl">
          {error || 'No avatar found. Please create one first.'}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black">
      <ChatProvider>
        <UI />
        <Scene3D />
      </ChatProvider>
    </div>
  );
}

export default function Home() {
  return (
    <AvatarProvider>
      <HomeContent />
    </AvatarProvider>
  );
}
