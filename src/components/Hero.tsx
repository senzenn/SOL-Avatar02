'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useState, useCallback } from 'react';
import { Environment, ScrollControls, useScroll } from '@react-three/drei';
import { JumpSuit } from './3D/JumpSuit';
import { useThree, useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { ErrorBoundary } from 'react-error-boundary';
import { TypeAnimation } from 'react-type-animation';
import VerticalMarquee from './VerticalMarquee';

function Scene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const groupRef = useRef<Group>(null);
  const scroll = useScroll();
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3(0, 2, 4));

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Calculate scroll progress (0 to 1)
    const scrollProgress = scroll.offset;
    
    // Camera movement path - Start from head (y: 2) and move down to feet (y: -2)
    targetPosition.current.y = 2 - scrollProgress * 4;
    // Zoom out slightly as we move down
    targetPosition.current.z = 4 + scrollProgress * 1;
    // Subtle sideways movement
    targetPosition.current.x = Math.sin(scrollProgress * Math.PI) * 0.5;

    // Smooth camera movement with delta time
    camera.position.lerp(targetPosition.current, 0.1 * delta * 60);

    // Model rotation based on scroll and mouse
    const baseRotation = scrollProgress * Math.PI * 2; // Full rotation during scroll
    const mouseInfluence = 0.1;

    // Smooth model rotation with delta time
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      baseRotation + (mousePosition.x * mouseInfluence),
      0.1 * delta * 60
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mousePosition.y * mouseInfluence,
      0.1 * delta * 60
    );
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* Main light */}
      <directionalLight
        position={[5, 3, 2]}
        intensity={2}
        color="#00ff9d"
        castShadow
      />
      {/* Rim light */}
      <directionalLight
        position={[-5, -2, -2]}
        intensity={1.5}
        color="#0066ff"
      />
      {/* Top light */}
      <directionalLight
        position={[0, 5, 5]}
        intensity={1}
        color="#ffd700"
      />
      {/* Moving fill light */}
      <directionalLight
        position={[targetPosition.current.x, targetPosition.current.y + 5, targetPosition.current.z + 5]}
        intensity={1}
        color="#ffffff"
      />
      <ambientLight intensity={0.2} />
      <group scale={8} position={[0, -2, 0]}>
        <JumpSuit />
      </group>
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
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[300vh] w-full overflow-hidden bg-gradient-to-br from-black to-[#0a1f1c]"
    >
      <div className="fixed inset-0">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Canvas
            camera={{ position: [0, 2, 4], fov: 25 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
            }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <ScrollControls pages={3} damping={0.2}>
                <Scene mousePosition={mousePosition} />
              </ScrollControls>
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      </div>

      <div className="relative z-10">
        <VerticalMarquee />
      </div>

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