'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmbedPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const iframeCode = `<iframe
  src="${baseUrl}/create"
  width="100%"
  height="600px"
  style="border: none; border-radius: 12px;"
  allow="camera *; microphone *"
></iframe>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Avatar Creator Embed</h1>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/create')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Create Avatar
            </button>
            <button
              onClick={handleCopy}
              className={`px-6 py-2 ${
                copied ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
              } rounded-lg transition-colors`}
            >
              {copied ? 'Copied!' : 'Copy Embed Code'}
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <div className="w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden">
            <iframe
              src="/create"
              className="w-full h-full"
              allow="camera *; microphone *"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Embed Code</h2>
          <div className="relative">
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{iframeCode}</code>
            </pre>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <div className="bg-gray-900 p-6 rounded-lg">
            <ol className="list-decimal list-inside space-y-3">
              <li>Copy the embed code above</li>
              <li>Paste it into your website&apos;s HTML where you want the avatar creator to appear</li>
              <li>The avatar creator will automatically adjust to the width of its container</li>
              <li>You can adjust the height by modifying the height attribute in the iframe code</li>
              <li>Make sure your website&apos;s Content Security Policy (CSP) allows embedding from {baseUrl}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 