'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
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
  // Start from a position that shows the head
  const targetPosition = useRef(new Vector3(0, 2.2, 3));

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Calculate scroll progress (0 to 1)
    const scrollProgress = scroll.offset;
    
    // Camera movement path - Start from head level and move down
    const easeProgress = scrollProgress < 0.5
      ? 4 * scrollProgress * scrollProgress * scrollProgress
      : 1 - Math.pow(-2 * scrollProgress + 2, 3) / 6;
    
    // Vertical movement (head to toe)
    // Start at y=2 (head level) and move down to y=-2 (feet level)
    targetPosition.current.y = 2.2 - (easeProgress * 4);
    console.log(targetPosition.current.y);
    
    // Dynamic zoom based on vertical position
    // Start closer when viewing head, zoom out as we move down
    const zoomCurve = Math.sin(scrollProgress * Math.PI);
    targetPosition.current.z = 3 + (scrollProgress * 2) + (zoomCurve * 1);
    console.log(targetPosition.current.z);
    
    // Horizontal movement for more dynamic viewing angle
    // Smaller movement at start, larger as we move down
    targetPosition.current.x = Math.sin(scrollProgress * Math.PI * 2) * (0.5 + scrollProgress * 0.5);
    console.log(targetPosition.current.x);
    // Smooth camera movement with delta time
    camera.position.lerp(targetPosition.current, 0.08 * delta * 60);
    
    // Look at the current focus point (slightly ahead of camera)
    const lookAtY = targetPosition.current.y - 0.5;
    camera.lookAt(new THREE.Vector3(0, lookAtY, 0));

    // Model rotation based on scroll and mouse
    const baseRotation = scrollProgress * Math.PI * 2; // One full rotation during scroll
    const mouseInfluence = 0.2;

    // Smooth model rotation with delta time
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      baseRotation + (mousePosition.x * mouseInfluence),
      0.1 * delta * 60
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mousePosition.y * mouseInfluence * 0.5, // Reduced vertical tilt
      0.1 * delta * 60
    );
  });

  return (
    <group ref={groupRef} dispose={null} position={[0, -1, 0]}> {/* Adjusted base position */}
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
      <group scale={4} position={[0, -4, 0]}>
        <JumpSuit />
      </group>
      <Environment preset="warehouse" />
    </group>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-transparent border-yellow-400 rounded-full animate-spin mb-4" />
        <p className="text-lg font-syne text-yellow-400">Loading 3D Model...</p>
      </div>
    </div>
  );
}

// Error fallback component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
      <div className="bg-red-900/20 p-6 rounded-lg max-w-md text-center">
        <h2 className="text-xl font-bold mb-2 font-syne text-yellow-400">Error Loading Model</h2>
        <p className="text-sm opacity-80 font-grotesk text-white">{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-yellow-400/20 text-yellow-400 font-grotesk hover:bg-yellow-400/30 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function TextOverlay() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="fixed top-1/2 right-8 md:right-16 -translate-y-1/2 z-30 pointer-events-none">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-4xl font-syne text-white">
            Ciao, everyone!
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-1/2 right-8 md:right-16 -translate-y-1/2 z-30">
      <div className="max-w-xl backdrop-blur-sm bg-black/30 p-8 rounded-lg">
        {/* <TypeAnimation
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
          className="text-3xl md:text-4xl font-syne text-white mb-6"
          repeat={0}
          cursor={true}
        /> */}
        <div className="space-y-4">
          {/* <p className="text-base md:text-lg text-[#888] font-grotesk leading-relaxed">
            crafting beautiful stuff with the{' '}
            <span className="text-yellow-400">amaaaazing</span> people at{' '}
            <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors pointer-events-auto">
              Team99
            </a>{' '}
            - Modena Branding Agency.
          </p>
          <p className="text-base md:text-lg text-[#888] font-grotesk">
            For any info, just{' '}
            <a href="#contact" className="text-yellow-400 hover:text-yellow-300 transition-colors pointer-events-auto">
              contact me
            </a>
            !
          </p> */}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMousePosition({ x, y });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-[300vh] w-full overflow-hidden bg-gradient-to-br from-black to-[#0a1f1c]"
    >
      {/* 3D Canvas Container */}
      <div className="fixed inset-0 z-10">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Canvas
            camera={{ position: [0, 2, 4], fov: 25 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
            }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <ScrollControls pages={3} damping={0.2}>
                <Scene mousePosition={mousePosition} />
              </ScrollControls>
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Loading Overlay */}
      {isLoading && <LoadingFallback />}

      {/* Vertical Marquee */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-20">
        <VerticalMarquee />
      </div>

      {/* Text Content */}
      <TextOverlay />

      {/* Social Links */}
      {/* <div className="fixed bottom-8 right-8 flex space-x-4 z-40">
        <a 
          href="#" 
          className="w-10 h-10 border border-yellow-400 flex items-center justify-center rounded-none hover:bg-yellow-400/20 transition-colors"
          aria-label="Email"
        >
          <span className="text-yellow-400 font-syne text-sm">@</span>
        </a>
        <a 
          href="#" 
          className="w-10 h-10 border border-yellow-400 flex items-center justify-center rounded-none hover:bg-yellow-400/20 transition-colors"
          aria-label="Like"
        >
          <span className="text-yellow-400 font-syne text-sm">♥</span>
        </a>
      </div> */}
    </div>
  );
}