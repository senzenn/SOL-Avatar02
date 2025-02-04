import React, { useState } from 'react';

interface StepGuideProps {
  onComplete?: () => void;
}

interface Step {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const steps: Step[] = [
  {
    title: "Step 1: Customize Your Widget",
    description: "Use the settings panel to adjust the appearance and behavior of your avatar widget. Preview the changes in real-time to ensure it matches your website's design."
  },
  {
    title: "Step 2: Copy the Code",
    description: "Once you're satisfied with the preview, click the \"Copy Code\" button to get your customized embed code. The code includes all your selected preferences."
  },
  {
    title: "Step 3: Add to Your Website",
    description: "Paste the embed code into your website's HTML where you want the avatar to appear. The widget will automatically initialize with your wallet connection."
  }
];

export function StepGuide({ onComplete }: StepGuideProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      setActiveStep(prev => Math.max(prev - 1, 0));
    }
  };

  return (
    <div 
      className="bg-gray-800 rounded-xl p-6"
      role="region"
      aria-label="Integration Guide"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <h2 className="text-2xl font-semibold mb-6">Integration Guide</h2>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`bg-gray-700 p-4 rounded-lg transition-all duration-300 ${
              activeStep === index ? 'ring-2 ring-blue-500 transform scale-[1.02]' : 'hover:bg-gray-600'
            }`}
            role="button"
            tabIndex={0}
            onClick={() => setActiveStep(index)}
            aria-expanded={activeStep === index}
          >
            <h3 className="text-lg font-medium mb-3">{step.title}</h3>
            <p className="text-gray-300">{step.description}</p>
          </div>
        ))}

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Important Notes</h3>
          <ul 
            className="list-disc list-inside space-y-2 text-gray-300"
            role="list"
            aria-label="Important considerations"
          >
            <li>Ensure your website has a Content Security Policy (CSP) that allows embedding from our domain</li>
            <li>The widget requires a Solana wallet connection to function properly</li>
            <li>Users will need to connect their own wallets to interact with the avatar</li>
            <li>Monthly subscription is required to keep the avatar active</li>
          </ul>
        </div>

        <div 
          className="bg-gray-700 p-4 rounded-lg"
          role="complementary"
          aria-label="Help and Support"
        >
          <h3 className="text-lg font-medium mb-3">Need Help?</h3>
          <p className="text-gray-300">
            If you encounter any issues or need assistance, please check our documentation
            or contact our support team. We're here to help you get the most out of your
            3D avatar integration.
          </p>
          {onComplete && (
            <button
              onClick={onComplete}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
              aria-label="Complete integration guide"
            >
              Got it
            </button>
          )}
        </div>
      </div>

      <div 
        className="mt-4 flex justify-between text-sm text-gray-400"
        role="navigation"
        aria-label="Guide navigation"
      >
        <button
          onClick={() => setActiveStep(prev => Math.max(prev - 1, 0))}
          disabled={activeStep === 0}
          className="disabled:opacity-50"
          aria-label="Previous step"
        >
          ← Previous
        </button>
        <span>{activeStep + 1} of {steps.length}</span>
        <button
          onClick={() => setActiveStep(prev => Math.min(prev + 1, steps.length - 1))}
          disabled={activeStep === steps.length - 1}
          className="disabled:opacity-50"
          aria-label="Next step"
        >
          Next →
        </button>
      </div>
    </div>
  );
} 