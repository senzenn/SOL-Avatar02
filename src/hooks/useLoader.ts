'use client';

import { useState, useEffect } from 'react';

export const useLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTime = Date.now();
    const minLoadTime = 12000; // Minimum loading time of 12 seconds
    const maxLoadTime = 15000; // Maximum loading time of 15 seconds
    let animationFrame: number;

    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      // Calculate progress with easing
      let timeProgress = Math.min((elapsed / maxLoadTime) * 100, 100);
      timeProgress = Math.pow(timeProgress / 100, 0.8) * 100; // Apply easing
      
      // Add small random variation for organic feel
      const jitter = Math.random() * 0.3 - 0.15;
      const finalProgress = Math.min(Math.max(timeProgress + jitter, 0), 100);
      
      // Update progress
      setProgress(finalProgress);
      
      // Continue animation or complete
      if (elapsed < minLoadTime || timeProgress < 100) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Add delay before hiding loader
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    // Start progress animation
    animationFrame = requestAnimationFrame(updateProgress);

    // Cleanup function
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      setIsLoading(false);
      setProgress(0);
    };
  }, []);

  return { isLoading, progress };
}; 