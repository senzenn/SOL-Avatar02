'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import { JumpSuit } from './3D/JumpSuit';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useThree } from '@react-three/fiber';
import { Group, DirectionalLight, Color, PointLight } from 'three';
import { ErrorBoundary } from 'react-error-boundary';
import { TypeAnimation } from 'react-type-animation';
import VerticalMarquee from './VerticalMarquee';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function Scene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    // Initial animation
    gsap.from(groupRef.current.rotation, {
      y: 0,
      duration: 2,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;

    // Mouse follow effect
    gsap.to(groupRef.current.rotation, {
      x: mousePosition.y * 0.05,
      y: mousePosition.x * 0.05,
      duration: 1,
      ease: 'power2.out'
    });
  }, [mousePosition]);

  return (
    <group ref={groupRef}>
      {/* Main teal/green light from front-right */}
      <directionalLight
        position={[5, 3, 2]}
        intensity={4}
        color="#00ff9d"
      />
      {/* Blue rim light from back-left */}
      <directionalLight
        position={[-5, -2, -2]}
        intensity={3}
        color="#0066ff"
      />
      {/* Yellow accent light */}
      <directionalLight
        position={[0, 5, 5]}
        intensity={2}
        color="#ffd700"
      />
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.2} />
      <JumpSuit 
        scale={6} 
        position={[0, -8, -2]} 
        rotation={[0, 0, 0]} 
      />
      <Environment preset="warehouse" />
    </group>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-white">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mb-4" />
        <p className="text-lg font-mono tracking-[-0.05em]">Loading 3D Model...</p>
      </div>
    </div>
  );
}

// Error fallback component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-white">
      <div className="bg-red-500/20 p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-2 font-mono tracking-[-0.05em]">Something went wrong:</h2>
        <p className="text-sm opacity-80 font-mono tracking-[-0.05em]">{error.message}</p>
      </div>
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMousePosition({ x, y });
  }, []);

  return (
    <div 
      id="hero-section"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #0a1f1c 100%)',
      }}
    >
      {/* Vertical Marquee */}
      <VerticalMarquee />

      {/* 3D Scene */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 0, 4], fov: 25 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Scene mousePosition={mousePosition} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-end justify-center pr-8 md:pr-16 z-10 pointer-events-none">
        <div className="max-w-xl space-y-4">
          <TypeAnimation
            sequence={[
              'Ciao, everyone!',
              1000,
              "I'm Dima, a Web developer.",
              1000,
              'Originally from Ukraine🇺🇦,',
              1000,
              'now live in Modena',
              1000,
            ]}
            wrapper="h1"
            speed={50}
            className="text-3xl md:text-4xl font-mono text-white mb-4 tracking-[-0.05em] leading-relaxed"
            repeat={0}
            cursor={true}
            style={{ 
              letterSpacing: '-0.05em',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 400
            }}
          />
          <p className="text-base md:text-lg text-[#888] font-mono leading-relaxed tracking-[-0.05em]"
             style={{ 
               letterSpacing: '-0.05em',
               fontFamily: "'JetBrains Mono', monospace",
               fontWeight: 400
             }}
          >
            crafting beautiful stuff with the{' '}
            <span className="text-yellow-400">amaaaazing</span> people at{' '}
            <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors pointer-events-auto">
              Team99
            </a>{' '}
            - Modena Branding Agency.
          </p>
          <p className="text-base md:text-lg text-[#888] font-mono tracking-[-0.05em]"
             style={{ 
               letterSpacing: '-0.05em',
               fontFamily: "'JetBrains Mono', monospace",
               fontWeight: 400
             }}
          >
            For any info, just{' '}
            <a href="#contact" className="text-yellow-400 hover:text-yellow-300 transition-colors pointer-events-auto">
              contact me
            </a>
            !
          </p>
        </div>
      </div>

      {/* Social Links */}
      <div className="absolute bottom-8 right-8 flex space-x-4 z-20">
        <a 
          href="#" 
          className="w-8 h-8 border border-yellow-400 flex items-center justify-center rounded-none hover:bg-yellow-400/20 transition-colors"
        >
          <span className="text-yellow-400 font-mono text-sm">@</span>
        </a>
        <a 
          href="#" 
          className="w-8 h-8 border border-yellow-400 flex items-center justify-center rounded-none hover:bg-yellow-400/20 transition-colors"
        >
          <span className="text-yellow-400 font-mono text-sm">♥</span>
        </a>
      </div>
    </div>
  );
}