import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}; 