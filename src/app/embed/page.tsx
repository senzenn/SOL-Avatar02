'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useSearchParams } from 'next/navigation';
import { Copy, Check } from 'lucide-react';

const SIZES = [
  { value: 'small', label: 'Small (300x400)' },
  { value: 'medium', label: 'Medium (400x600)' },
  { value: 'large', label: 'Large (600x800)' },
  { value: 'full', label: 'Full Height' },
];

export default function EmbedPage() {
  const searchParams = useSearchParams();
  const modelId = searchParams?.get('modelId') || '';
  const [size, setSize] = useState('medium');
  const [copied, setCopied] = useState(false);
  const [previewHeight, setPreviewHeight] = useState('600px');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Update preview height based on selected size
    setPreviewHeight(
      size === 'small' ? '400px' :
      size === 'medium' ? '600px' :
      size === 'large' ? '800px' :
      '100vh'
    );
  }, [size]);

  const embedCode = `<iframe
  src="${process.env.NEXT_PUBLIC_APP_URL}/embed/widget?modelId=${modelId}&size=${size}"
  width="${size === 'small' ? '300' : size === 'medium' ? '400' : size === 'large' ? '600' : '100%'}"
  height="${size === 'small' ? '400' : size === 'medium' ? '600' : size === 'large' ? '800' : '100%'}"
  frameborder="0"
  allow="camera; microphone; autoplay; fullscreen"
></iframe>

<script src="${process.env.NEXT_PUBLIC_APP_URL}/embed/script.js"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-[1800px] mx-auto p-3 sm:p-4 md:p-6">
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-[1fr,280px] gap-4'}`}>
          {/* Preview Section */}
          <div className="space-y-3 sm:space-y-4">
            <Card className="bg-[#111111] border-gray-800 overflow-hidden">
              <div style={{ height: previewHeight }} className="relative transition-all duration-300">
                <iframe
                  src={`/embed/widget?modelId=${modelId}&size=${size}`}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="camera; microphone; autoplay; fullscreen"
                />
              </div>
            </Card>

            {/* Embed Code Section */}
            <Card className="bg-[#111111] border-gray-800 p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h2 className="text-sm font-medium text-gray-400">Embed Code</h2>
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="sm"
                  className="h-7 sm:h-8 text-xs text-gray-400 hover:text-white hover:bg-[#1A1A1A]"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <pre className="bg-[#1A1A1A] p-3 rounded-lg overflow-x-auto text-xs text-gray-300 border border-gray-800">
                <code>{embedCode}</code>
              </pre>
            </Card>
          </div>

          {/* Configuration Section */}
          <Card className={`bg-[#111111] border-gray-800 p-3 sm:p-4 h-fit ${isMobile ? 'order-first' : ''}`}>
            <h2 className="text-sm font-medium text-gray-400 mb-3 sm:mb-4">Configuration</h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label className="text-xs text-gray-500">Size</Label>
                <Select
                  value={size}
                  onValueChange={setSize}
                  options={SIZES}
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-500">Model ID</Label>
                <Input
                  value={modelId}
                  readOnly
                  className="mt-1 text-xs bg-[#1A1A1A] border-gray-800"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 