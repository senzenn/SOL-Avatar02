'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AvatarData {
  id: string;
  modelPath: string;
  originalUrl: string;
  createdAt: string;
}

interface AvatarContextType {
  avatarData: AvatarData | null;
  isLoading: boolean;
  error: string | null;
  refreshAvatar: () => Promise<void>;
}

const AvatarContext = createContext<AvatarContextType>({
  avatarData: null,
  isLoading: true,
  error: null,
  refreshAvatar: async () => {},
});

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatarData, setAvatarData] = useState<AvatarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAvatar = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/avatar');
      const avatars = await response.json();
      
      // Get the most recent avatar
      const latestAvatar = avatars.sort((a: AvatarData, b: AvatarData) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      if (latestAvatar) {
        setAvatarData(latestAvatar);
      }
    } catch (error) {
      console.error('Error loading avatar:', error);
      setError('Failed to load avatar');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  return (
    <AvatarContext.Provider value={{ avatarData, isLoading, error, refreshAvatar: loadAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const context = useContext(AvatarContext);
  if (context === undefined) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
} 