export interface Message {
  text: string;
  audio?: string;
  lipsync?: any;
  facialExpression?: string;
  animation?: string;
  time?: string;
  isAI?: boolean;
  id?: string;
}

export interface ChatContextType {
  chat: (message: string) => Promise<void>;
  message: Message | null;
  loading: boolean;
  error: string | null;
  cameraZoomed: boolean;
  setCameraZoomed: (zoomed: boolean) => void;
  currentAnimation: string | null;
  setCurrentAnimation: (animation: string | null) => void;
} 
