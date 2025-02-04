export interface SDKConfig {
  voiceId: string;
  personality: string;
  cameraType: string;
  backgroundImage: string;
  lightingType: string;
}

export type SDKConfigKey = keyof SDKConfig;

export const DEFAULT_SDK_CONFIG: SDKConfig = {
  voiceId: '',
  personality: 'friendly',
  cameraType: 'default',
  backgroundImage: '',
  lightingType: 'studio'
}; 