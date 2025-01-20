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
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex flex-col pointer-events-none">
      {/* Header */}
      {/* <header className="bg-black/50 backdrop-blur-sm p-4 flex items-center justify-between pointer-events-auto">
        <h1 className="text-pink-500 font-bold text-xl">VIRTUAL GF</h1>
        <nav className="flex gap-6 text-gray-300" aria-label="Main navigation">
          <NavLink href="#about">ABOUT</NavLink>
          <NavLink href="#features">FEATURES</NavLink>
          <NavLink href="create"> CREATE </NavLink>
        </nav>
      </header> */}

      {/* Spacer to push input to bottom */}
      <div className="flex-1" aria-hidden="true"></div>

      {/* Chat Input */}
      <div className="p-4 bg-black/30 backdrop-blur-sm pointer-events-auto">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            ref={input}
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-black/50 backdrop-blur-sm text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
            onKeyPress={handleKeyPress}
            aria-label="Chat message"
            disabled={loading || !!message}
          />
          
          <button
            onClick={sendMessage}
            disabled={loading || !!message}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
});

UI.displayName = "UI";
