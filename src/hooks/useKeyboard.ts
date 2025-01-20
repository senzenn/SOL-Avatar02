import { useEffect } from 'react';

interface KeyboardHandlers {
  onSpace?: () => void;
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onTab?: () => void;
}

export function useKeyboard(handlers: KeyboardHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for specified keys
      if (['Space', 'ArrowUp', 'ArrowDown'].includes(event.code)) {
        event.preventDefault();
      }

      switch (event.code) {
        case 'Space':
          handlers.onSpace?.();
          break;
        case 'Escape':
          handlers.onEscape?.();
          break;
        case 'Enter':
          handlers.onEnter?.();
          break;
        case 'ArrowUp':
          handlers.onArrowUp?.();
          break;
        case 'ArrowDown':
          handlers.onArrowDown?.();
          break;
        case 'Tab':
          handlers.onTab?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
} 