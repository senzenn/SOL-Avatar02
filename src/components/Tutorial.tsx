import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TutorialStep {
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to Your Avatar",
    description: "This is your personalized AI companion. You can interact with it through chat and voice.",
    target: ".avatar-container",
    position: "right"
  },
  {
    title: "Chat Interface",
    description: "Type your messages here to communicate with your avatar. The conversation is natural and context-aware.",
    target: ".chat-input",
    position: "top"
  },
  {
    title: "Real-time Responses",
    description: "Watch your avatar respond with facial expressions and natural speech.",
    target: ".avatar-display",
    position: "left"
  }
];

interface TutorialProps {
  onComplete: () => void;
  isVisible: boolean;
}

export function Tutorial({ onComplete, isVisible }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      const targetElement = document.querySelector(tutorialSteps[currentStep].target);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const tooltip = tooltipRef.current;
        
        gsap.fromTo(tooltip,
          { opacity: 0, scale: 0.9 },
          { 
            opacity: 1, 
            scale: 1,
            duration: 0.4,
            ease: "power2.out"
          }
        );

        // Position tooltip based on step position
        switch(tutorialSteps[currentStep].position) {
          case 'top':
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            break;
          case 'bottom':
            tooltip.style.top = `${rect.bottom + 10}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            break;
          case 'left':
            tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltip.offsetHeight / 2)}px`;
            tooltip.style.left = `${rect.left - tooltip.offsetWidth - 10}px`;
            break;
          case 'right':
            tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltip.offsetHeight / 2)}px`;
            tooltip.style.left = `${rect.right + 10}px`;
            break;
        }
      }
    }
  }, [currentStep, isVisible]);

  if (!isVisible) return null;

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = tutorialSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 max-w-sm bg-white rounded-2xl shadow-xl p-6 transform transition-transform duration-300"
      >
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {step.title}
          </h3>
          <p className="text-gray-600">
            {step.description}
          </p>
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip Tutorial
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transform hover:scale-105 transition-all duration-300"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
} 