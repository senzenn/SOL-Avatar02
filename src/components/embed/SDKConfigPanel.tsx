import { SDKConfig, SDKConfigKey } from '@/types/sdk';

interface SDKConfigPanelProps {
  config: SDKConfig;
  onChange: (key: SDKConfigKey, value: string) => void;
}

export function SDKConfigPanel({ config, onChange }: SDKConfigPanelProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        SDK Configuration
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Voice ID</label>
          <input
            type="text"
            value={config.voiceId}
            onChange={(e) => onChange('voiceId', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-200"
            placeholder="Enter voice ID"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Personality</label>
          <select
            value={config.personality}
            onChange={(e) => onChange('personality', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-200"
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="energetic">Energetic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Camera Type</label>
          <select
            value={config.cameraType}
            onChange={(e) => onChange('cameraType', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-200"
          >
            <option value="default">Default</option>
            <option value="closeup">Close-up</option>
            <option value="full">Full Body</option>
            <option value="portrait">Portrait</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Background Image</label>
          <input
            type="text"
            value={config.backgroundImage}
            onChange={(e) => onChange('backgroundImage', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-200"
            placeholder="Enter background image URL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Lighting Type</label>
          <select
            value={config.lightingType}
            onChange={(e) => onChange('lightingType', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-200"
          >
            <option value="studio">Studio</option>
            <option value="natural">Natural</option>
            <option value="dramatic">Dramatic</option>
            <option value="soft">Soft</option>
          </select>
        </div>
      </div>
    </div>
  );
} 