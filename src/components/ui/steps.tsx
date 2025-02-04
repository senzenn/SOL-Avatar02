import React from 'react';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  description: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const Steps: React.FC<StepsProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={cn(
              'flex flex-col items-center w-full',
              index !== steps.length - 1 && 'relative'
            )}
          >
            <button
              onClick={() => onStepClick?.(index)}
              disabled={index > currentStep}
              className={cn(
                'w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2',
                index === currentStep
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : index < currentStep
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-white border-gray-300 text-gray-500'
              )}
            >
              {index < currentStep ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </button>
            
            {index !== steps.length - 1 && (
              <div
                className={cn(
                  'absolute top-5 left-1/2 w-full h-0.5',
                  index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                )}
              />
            )}
            
            <div className="text-center mt-2">
              <div className="font-medium">{step.title}</div>
              <div className="text-sm text-gray-500">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 