import { createContext, useContext, useState } from 'react';

interface AvatarData {
  modelPath: string;
}

interface AvatarContextType {
  avatarData: AvatarData | null;
  setAvatarData: (data: AvatarData | null) => void;
  isLoading: boolean;
  error: string | null;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatarData, setAvatarData] = useState<AvatarData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = {
    avatarData,
    setAvatarData,
    isLoading,
    error
  };

  return (
    <AvatarContext.Provider value={value}>
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