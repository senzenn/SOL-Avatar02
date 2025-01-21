'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoader } from '@/hooks/useLoader';

const quotes = [
  "EMBRACING THE FUTURE OF DIGITAL IDENTITY",
  "EXQUISITELY DESIGNED FOR THE SOLANA ECOSYSTEM",
  "WHERE IMAGINATION MEETS BLOCKCHAIN",
  "YOUR UNIQUE DIGITAL PRESENCE AWAITS",
  "CRAFTING THE NEXT GENERATION OF AVATARS",
];

export default function LoaderPage() {
  const { isLoading, progress } = useLoader();
  const [quote, setQuote] = useState(quotes[0]);
  const [displayedProgress, setDisplayedProgress] = useState(0);

  useEffect(() => {
    // Smooth progress update
    const updateProgress = () => {
      setDisplayedProgress(prev => {
        const diff = progress - prev;
        return prev + (diff * 0.05); // Slower progress updates
      });
    };
    const progressInterval = setInterval(updateProgress, 16);
    return () => clearInterval(progressInterval);
  }, [progress]);

  useEffect(() => {
    // Rotate through quotes
    const quoteTimer = setInterval(() => {
      setQuote(prev => {
        const currentIndex = quotes.indexOf(prev);
        return quotes[(currentIndex + 1) % quotes.length];
      });
    }, 4000); // Longer quote display time

    return () => clearInterval(quoteTimer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-black text-white"
        >
          {/* Top Section */}
          <div className="w-full flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-4xl font-syne font-bold tracking-tighter"
            >
              SOLAVATAR
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm md:text-base font-grotesk tracking-wide text-right max-w-[50%]"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={quote}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {quote}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Center Content */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-[20vw] font-syne font-bold tracking-tighter"
            >
              {Math.floor(displayedProgress)}
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2">
            <motion.div 
              className="text-sm font-grotesk tracking-wider text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              LOADING ASSETS
            </motion.div>
            <div className="w-full h-1 bg-white/20">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${displayedProgress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-200"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 