import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MessageType {
  message: string;
}

interface ChatContextType {
  messages: MessageType[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
}

export default function Chat() {
  const [input, setInput] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const timeline = useRef<gsap.core.Timeline>();
  // @ts-ignore
  const { messages, isLoading, error, sendMessage }: ChatContextType = useChat();

  // Initialize GSAP animations
  useEffect(() => {
    timeline.current = gsap.timeline({ paused: true });

    if (chatRef.current && formRef.current && messagesRef.current) {
      // Initial setup - move elements to their starting positions
      timeline.current
        .set(chatRef.current, { y: '100%' })
        .set(messagesRef.current, { opacity: 0, y: 20 })
        .set(formRef.current, { opacity: 0, y: 20 })
        // Animate in sequence
        .to(chatRef.current, {
          y: '0%',
          duration: 0.8,
          ease: 'power3.out'
        })
        .to(messagesRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        })
        .to(formRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.3');

      timeline.current.play();
    }

    return () => {
      if (timeline.current) timeline.current.kill();
    };
  }, []);

  // Toggle chat visibility
  const toggleChat = () => {
    if (chatRef.current) {
      gsap.to(chatRef.current, {
        y: isVisible ? '90%' : '0%',
        duration: 0.5,
        ease: 'power2.inOut'
      });
      setIsVisible(!isVisible);
    }
  };

  // Animate new messages
  useEffect(() => {
    if (messagesRef.current) {
      const newMessages = messagesRef.current.children;
      if (newMessages.length > 0) {
        const lastMessage = newMessages[newMessages.length - 1];
        gsap.fromTo(lastMessage,
          { 
            opacity: 0, 
            y: 20,
            scale: 0.95
          },
          { 
            opacity: 1, 
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "elastic.out(1, 0.8)"
          }
        );
        
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { scale: 1 },
        { 
          scale: 0.98,
          duration: 0.1,
          ease: "power1.out",
          yoyo: true,
          repeat: 1
        }
      );
    }

    await sendMessage(input);
    setInput('');
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 z-50 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chat Interface */}
      <div 
        ref={chatRef} 
        className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-lg transition-all duration-300"
      >
        <div className="max-w-4xl mx-auto">
          {/* Messages Container */}
          <div 
            ref={messagesRef}
            className="mb-6 h-[60vh] overflow-y-auto rounded-2xl bg-black/40 p-6 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent"
          >
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={cn(
                  "mb-4 p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02]",
                  i % 2 === 0 
                    ? "bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/20" 
                    : "bg-purple-500/10 border border-purple-500/10 hover:border-purple-500/20"
                )}
              >
                <p className="text-white/90 text-lg leading-relaxed">{msg.message}</p>
              </div>
            ))}
            {error && (
              <div className="mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 animate-shake">
                <p className="text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form 
            ref={formRef}
            onSubmit={handleSubmit} 
            className="relative flex gap-4 transform transition-all duration-300"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-4 rounded-2xl bg-white/5 text-white placeholder-gray-400 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-lg shadow-lg hover:bg-white/10"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={cn(
                "px-8 py-4 rounded-2xl font-medium text-lg transition-all duration-300 transform shadow-lg",
                isLoading 
                  ? "bg-blue-500/50 text-white/70 cursor-not-allowed" 
                  : "bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              )}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                'Send'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
} 