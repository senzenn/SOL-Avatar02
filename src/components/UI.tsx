"use client";

import { useRef, useCallback, memo } from "react";
import { useChat } from "../hooks/useChat";

interface UIProps {
  hidden?: boolean;
}

const NavLink = memo(
  ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="hover:text-pink-500 transition-colors"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
);
NavLink.displayName = "NavLink";

export const UI = memo(({ hidden }: UIProps) => {
  const input = useRef<HTMLInputElement>(null);
  const { chat, loading, message } = useChat();

  const sendMessage = useCallback(() => {
    const text = input.current?.value;
    if (!loading && !message && text) {
      chat(text);
      input.current.value = "";
    }
  }, [chat, loading, message]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    },
    [sendMessage],
  );

  if (hidden) {
    return null;
  }

  return (
    <div className="absolute inset-x-0 bottom-0 z-10">
      <div className="p-4">
        <div className="relative">
          {/* White line */}
          <div className="absolute left-0 right-0 bottom-full mb-4 h-[2px] bg-white/10" />
          
          {/* Chat input container */}
          <div className="flex gap-2">
            <input
              ref={input}
              type="text"
              placeholder="Type your message..."
              className="flex-1 bg-[#1a1a1a]/80 backdrop-blur-sm text-white rounded-lg px-4 py-3 
                       border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20
                       placeholder:text-gray-400"
              onKeyPress={handleKeyPress}
              aria-label="Chat message"
              disabled={loading || !!message}
            />
            
            <button
              onClick={sendMessage}
              disabled={loading || !!message}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                       text-sm font-medium"
              aria-label={loading ? "Sending message..." : "Send message"}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

UI.displayName = "UI";
