import { useState } from 'react';

interface CodeSnippetProps {
  code: string;
}

export function CodeSnippet({ code }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Embed Code</h2>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg transition-colors ${
            copied
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      <div className="relative">
        <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
          <code className="text-sm text-gray-300 whitespace-pre-wrap break-all">
            {code}
          </code>
        </pre>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-400">
            ℹ️ Paste this code into your website where you want the avatar to appear
          </p>
          <p className="text-sm text-gray-400">
            💡 The avatar will automatically adjust to the specified dimensions
          </p>
        </div>
      </div>
    </div>
  );
} 