import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const skills = [
  'code shredder',
  'keyboard samurai',
  'frontend magician',
  'coffee enthusiast',
  'snowboard addict',
  'IPA explorer',
  'code ninja',
  'database wizard',
  'code architect',
  'regex guru',
];

export default function VerticalMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clone the content for seamless loop
    container.innerHTML += container.innerHTML;

    gsap.to(container, {
      y: '-50%',
      duration: 20,
      ease: 'none',
      repeat: -1,
    });
  }, []);

  return (
    <div className="fixed left-8 top-0 h-screen overflow-hidden pointer-events-none z-20">
      <div 
        ref={containerRef}
        className="text-yellow-400 font-mono text-lg tracking-[-0.05em] whitespace-nowrap transform -rotate-90 origin-left translate-y-8"
        style={{ 
          fontFamily: "'JetBrains Mono', monospace",
          writingMode: 'vertical-rl',
          textOrientation: 'mixed'
        }}
      >
        {skills.map((skill, index) => (
          <span key={index} className="mx-4">{skill}</span>
        ))}
      </div>
    </div>
  );
} 