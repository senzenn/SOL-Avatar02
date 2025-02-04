import { useWallet } from '@solana/wallet-adapter-react';

interface LivePreviewProps {
  settings: {
    width: string;
    height: string;
    theme: string;
    layout: string;
    animation: string;
  };
}

export function LivePreview({ settings }: LivePreviewProps) {
  const { publicKey } = useWallet();

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-6">Live Preview</h2>
      
      <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{
        width: settings.width,
        height: settings.height,
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        {publicKey ? (
          <iframe
            src={`/api/embed-preview?wallet=${publicKey.toString()}&theme=${settings.theme}&layout=${settings.layout}&animation=${settings.animation}`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="camera; microphone"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400">Please connect your wallet to see the preview</p>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-700 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Current Settings:</h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>Size: {settings.width} x {settings.height}</li>
          <li>Theme: {settings.theme}</li>
          <li>Layout: {settings.layout}</li>
          <li>Animation: {settings.animation}</li>
        </ul>
      </div>
    </div>
  );
} 