import { useState, useEffect } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { Tutorial } from './Tutorial';
import { Scene3D } from './Scene3D';
import { Chat } from './Chat';
import { useKeyboard } from '@/hooks/useKeyboard';

export function AppLayout() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true);

  // Handle welcome screen completion
  const handleGetStarted = () => {
    setShowWelcome(false);
    setShowTutorial(true);
  };

  // Handle tutorial completion
  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setHasCompletedTutorial(true);
    localStorage.setItem('hasCompletedTutorial', 'true');
  };

  // Check if user has already completed tutorial
  useEffect(() => {
    const hasCompleted = localStorage.getItem('hasCompletedTutorial');
    if (hasCompleted) {
      setShowWelcome(false);
      setHasCompletedTutorial(true);
    }
  }, []);

  // Keyboard controls
  useKeyboard({
    onSpace: () => {
      if (showWelcome) {
        handleGetStarted();
      }
    },
    onEscape: () => {
      if (showTutorial) {
        handleTutorialComplete();
      } else if (hasCompletedTutorial) {
        setIsChatVisible(!isChatVisible);
      }
    },
    onTab: () => {
      if (hasCompletedTutorial) {
        setShowTutorial(true);
      }
    }
  });

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Main Content */}
      <div 
        className={`transition-all duration-500 ${
          !hasCompletedTutorial ? 'opacity-50 blur-sm' : 'opacity-100 blur-0'
        }`}
      >
        <Scene3D />
      </div>

      {/* Welcome Screen */}
      {showWelcome && (
        <WelcomeScreen onGetStarted={handleGetStarted} />
      )}

      {/* Tutorial */}
      <Tutorial 
        isVisible={showTutorial} 
        onComplete={handleTutorialComplete}
      />

      {/* Chat Interface */}
      <div 
        className={`transition-all duration-500 transform ${
          !hasCompletedTutorial 
            ? 'opacity-0 translate-y-full' 
            : isChatVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-[90%]'
        }`}
      >
        <Chat />
      </div>

      {/* Settings Button */}
      {hasCompletedTutorial && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
          <button
            onClick={() => setIsChatVisible(!isChatVisible)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300"
            aria-label={isChatVisible ? "Hide Chat" : "Show Chat"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </button>

          <button
            onClick={() => setShowTutorial(true)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300"
            aria-label="Show Tutorial"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </button>

          {/* Keyboard Shortcuts Help */}
          <div className="fixed bottom-4 right-4 text-sm text-white/50">
            <div className="space-y-1">
              <p>Press <kbd className="px-2 py-1 bg-white/10 rounded">ESC</kbd> to toggle chat</p>
              <p>Press <kbd className="px-2 py-1 bg-white/10 rounded">TAB</kbd> to show tutorial</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 