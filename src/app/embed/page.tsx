'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EmbedSettings } from '@/components/embed/EmbedSettings';

export default function EmbedPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState({
    width: '100%',
    height: '600px',
    theme: 'dark',
    layout: 'vertical',
    animation: 'default'
  });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const iframeCode = `<iframe
  src="${baseUrl}/create?theme=${settings.theme}&layout=${settings.layout}&animation=${settings.animation}&hideNav=true"
  width="${settings.width}"
  height="${settings.height}"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);"
  allow="camera *; microphone *"
  title="Avatar Creator"
></iframe>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Avatar Creator Embed
            </h1>
            <p className="text-gray-400">Integrate our avatar creator seamlessly into your website</p>
          </div>
          <div className="space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => router.push('/create')}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Try Creator
            </button>
            <button
              onClick={handleCopy}
              className={`px-6 py-2.5 ${
                copied 
                  ? 'bg-green-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              } rounded-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {copied ? '✓ Copied!' : 'Copy Embed Code'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-xl p-1 mb-8 overflow-hidden">
              <iframe
                src={`/create?theme=${settings.theme}&layout=${settings.layout}&animation=${settings.animation}&hideNav=true`}
                className="w-full h-[600px] rounded-lg"
                allow="camera *; microphone *"
              />
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Embed Code</h2>
              <div className="relative">
                <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm font-mono text-gray-300">{iframeCode}</code>
                </pre>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <EmbedSettings 
              settings={settings}
              onSettingsChange={setSettings}
            />

            <div className="mt-8 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Quick Setup Guide</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-300">
                <li>Copy the embed code above</li>
                <li>Paste it into your website&apos;s HTML</li>
                <li>Customize appearance using the settings panel</li>
                <li>The creator will adapt to its container</li>
                <li>Ensure your CSP allows {baseUrl}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 