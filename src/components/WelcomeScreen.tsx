import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    if (containerRef.current && contentRef.current) {
      tl.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 }
      ).fromTo(contentRef.current.children,
        { 
          opacity: 0,
          y: 20
        },
        { 
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          ease: "power3.out"
        }
      );
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4 z-50"
    >
      <div 
        ref={contentRef}
        className="max-w-2xl mx-auto text-center space-y-8"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Welcome to Virtual Avatar
        </h1>
        
        <p className="text-xl text-gray-300 leading-relaxed">
          Experience natural conversations with your personalized AI companion
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <FeatureCard 
            icon="🎭"
            title="Personalized Avatar"
            description="Create and customize your unique AI companion"
          />
          <FeatureCard 
            icon="💬"
            title="Natural Chat"
            description="Engage in fluid, context-aware conversations"
          />
          <FeatureCard 
            icon="🔄"
            title="Real-time Response"
            description="Experience immediate, intelligent interactions"
          />
        </div>

        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-lg font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
          >
            Get Started
          </button>
          <p className="text-gray-400">
            Press Space or Click to begin your experience
          </p>
        </div>

        <div className="absolute bottom-8 left-0 right-0 text-center text-gray-500">
          <p>Scroll or swipe to explore more</p>
          <div className="animate-bounce mt-2">↓</div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-blue-500/20 transition-all duration-300 transform hover:scale-[1.02]">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
} 