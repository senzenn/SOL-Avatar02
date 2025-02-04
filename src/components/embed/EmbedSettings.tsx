import { useState } from 'react';

interface EmbedSettingsProps {
  settings: {
    width: string;
    height: string;
    theme: string;
    layout: string;
    animation: string;
  };
  onSettingsChange: (settings: any) => void;
}

export function EmbedSettings({ settings, onSettingsChange }: EmbedSettingsProps) {
  const handleChange = (key: string, value: string) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const presetSizes = [
    { label: 'Full Width', width: '100%', height: '600px' },
    { label: 'Square', width: '500px', height: '500px' },
    { label: 'Compact', width: '400px', height: '300px' },
  ];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Customize Embed
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Preset Sizes</label>
          <div className="grid grid-cols-3 gap-2">
            {presetSizes.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  handleChange('width', preset.width);
                  handleChange('height', preset.height);
                }}
                className={`px-3 py-2 text-sm rounded-lg transition-all ${
                  settings.width === preset.width && settings.height === preset.height
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Width</label>
            <input
              type="text"
              value={settings.width}
              onChange={(e) => handleChange('width', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400"
              placeholder="e.g. 100%, 500px"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Height</label>
            <input
              type="text"
              value={settings.height}
              onChange={(e) => handleChange('height', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-200 placeholder-gray-400"
              placeholder="e.g. 600px"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-200"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Layout</label>
          <select
            value={settings.layout}
            onChange={(e) => handleChange('layout', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-200"
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
            <option value="compact">Compact</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Animation Style</label>
          <select
            value={settings.animation}
            onChange={(e) => handleChange('animation', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-200"
          >
            <option value="default">Default</option>
            <option value="smooth">Smooth</option>
            <option value="energetic">Energetic</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
      </div>
    </div>
  );
} 