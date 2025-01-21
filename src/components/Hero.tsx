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
import LoaderPage from './LoaderPage';
import { motion, useTransform, useScroll as useScrollMotion, AnimatePresence } from 'framer-motion';

function Scene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const groupRef = useRef<Group>(null);
  const scroll = useScroll();
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3(0, 6, 8));
  const prevScroll = useRef(0);
  const velocityY = useRef(0);
  const smoothedProgress = useRef(0);

  // Define enhanced color palettes for different scroll positions
  const colorPalettes = [
    {
      main: new THREE.Color('#4ade80').multiplyScalar(2.0),    // Vibrant green
      rim: new THREE.Color('#818cf8').multiplyScalar(1.5),     // Soft purple
      top: new THREE.Color('#fbbf24').multiplyScalar(1.2),     // Warm gold
      fill: new THREE.Color('#22d3ee').multiplyScalar(0.8)     // Cyan
    },
    {
      main: new THREE.Color('#f472b6').multiplyScalar(1.8),    // Hot pink
      rim: new THREE.Color('#2dd4bf').multiplyScalar(1.4),     // Teal
      top: new THREE.Color('#facc15').multiplyScalar(1.0),     // Yellow
      fill: new THREE.Color('#a78bfa').multiplyScalar(0.9)     // Purple
    },
    {
      main: new THREE.Color('#60a5fa').multiplyScalar(2.0),    // Bright blue
      rim: new THREE.Color('#fb923c').multiplyScalar(1.6),     // Orange
      top: new THREE.Color('#34d399').multiplyScalar(1.2),     // Emerald
      fill: new THREE.Color('#f87171').multiplyScalar(0.8)     // Red
    },
    {
      main: new THREE.Color('#c084fc').multiplyScalar(1.8),    // Purple
      rim: new THREE.Color('#fcd34d').multiplyScalar(1.4),     // Amber
      top: new THREE.Color('#38bdf8').multiplyScalar(1.0),     // Sky blue
      fill: new THREE.Color('#4ade80').multiplyScalar(0.9)     // Green
    }
  ];

  // Create refs for light colors
  const mainLightColor = useRef(colorPalettes[0].main);
  const rimLightColor = useRef(colorPalettes[0].rim);
  const topLightColor = useRef(colorPalettes[0].top);
  const fillLightColor = useRef(colorPalettes[0].fill);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Calculate scroll progress (0 to 1)
    const scrollProgress = scroll.offset;
    
    // Calculate scroll velocity for smooth damping
    const scrollVelocity = (scrollProgress - prevScroll.current) / delta;
    prevScroll.current = scrollProgress;
    
    // Smooth out the progress using spring physics
    const springStrength = 4.0;
    const dampingFactor = 0.8;
    
    // Update velocity with spring physics
    const progressDiff = scrollProgress - smoothedProgress.current;
    velocityY.current += progressDiff * springStrength;
    velocityY.current *= dampingFactor;
    
    // Update smoothed progress with velocity
    smoothedProgress.current += velocityY.current * delta;
    
    // Clamp the smoothed progress
    smoothedProgress.current = Math.max(0, Math.min(1, smoothedProgress.current));
    
    // Use smoothed progress for camera movement
    const easeProgress = smoothedProgress.current;

    // Calculate color palette interpolation with smoother transitions
    const totalPalettes = colorPalettes.length;
    const cycleProgress = (easeProgress * totalPalettes) % totalPalettes;
    const paletteIndex = Math.floor(cycleProgress);
    const nextPaletteIndex = (paletteIndex + 1) % totalPalettes;
    const paletteProgress = cycleProgress - paletteIndex;

    // Apply smooth color interpolation with easing
    const easedProgress = THREE.MathUtils.smoothstep(paletteProgress, 0, 1);

    // Interpolate colors with easing
    mainLightColor.current.lerpColors(
      colorPalettes[paletteIndex].main,
      colorPalettes[nextPaletteIndex].main,
      easedProgress
    );
    rimLightColor.current.lerpColors(
      colorPalettes[paletteIndex].rim,
      colorPalettes[nextPaletteIndex].rim,
      easedProgress
    );
    topLightColor.current.lerpColors(
      colorPalettes[paletteIndex].top,
      colorPalettes[nextPaletteIndex].top,
      easedProgress
    );
    fillLightColor.current.lerpColors(
      colorPalettes[paletteIndex].fill,
      colorPalettes[nextPaletteIndex].fill,
      easedProgress
    );
    
    // Vertical movement (head to toe) with smooth easing
    // Start from y: 6 (above head) and move down to y: -4 (below feet)
    const verticalPosition = 12 - easeProgress *8 ;
    targetPosition.current.y = THREE.MathUtils.lerp(
      targetPosition.current.y,
      verticalPosition,
      0.1 * delta * 60
    );
    
    // Dynamic zoom based on vertical position with smooth interpolation
    const zoomBase = 8; // Start further back
    const zoomAmount = 3;
    const zoomCurve = Math.sin(easeProgress * Math.PI);
    const targetZoom = zoomBase - zoomCurve * zoomAmount;
    targetPosition.current.z = THREE.MathUtils.lerp(
      targetPosition.current.z,
      targetZoom,
      0.05 * delta * 60
    );
    
    // Smooth horizontal movement
    const horizontalOffset = Math.sin(easeProgress * Math.PI * 2) * 2;
    targetPosition.current.x = THREE.MathUtils.lerp(
      targetPosition.current.x,
      horizontalOffset,
      0.05 * delta * 60
    );

    // Apply smooth camera movement with variable interpolation factor
    const distanceToTarget = camera.position.distanceTo(targetPosition.current);
    const interpolationFactor = THREE.MathUtils.lerp(0.02, 0.1, distanceToTarget / 10);
    camera.position.lerp(targetPosition.current, interpolationFactor * delta * 60);
    
    // Smooth look-at point calculation
    const lookAtY = THREE.MathUtils.lerp(
      camera.position.y,
      targetPosition.current.y - 1,
      0.1 * delta * 60
    );
    camera.lookAt(new THREE.Vector3(0, lookAtY, 0));

    // Model rotation with smooth interpolation
    const baseRotation = easeProgress * Math.PI * 4;
    const mouseInfluence = 0.2;
    
    // Apply smooth rotation
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      baseRotation + (mousePosition.x * mouseInfluence),
      0.05 * delta * 60
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mousePosition.y * mouseInfluence,
      0.05 * delta * 60
    );
  });

  return (
    <group ref={groupRef} dispose={null}>
      {/* Main light - Increased intensity for more drama */}
      <directionalLight
        position={[5, 3, 2]}
        intensity={2.0}
        color={mainLightColor.current}
        castShadow
      />
      {/* Rim light - Positioned for better edge definition */}
      <directionalLight
        position={[-5, 1, -2]}
        intensity={1.4}
        color={rimLightColor.current}
      />
      {/* Top light - Adjusted for better highlight */}
      <directionalLight
        position={[0, 6, 4]}
        intensity={1.2}
        color={topLightColor.current}
      />
      {/* Moving fill light - Dynamic position */}
      <directionalLight
        position={[targetPosition.current.x, targetPosition.current.y + 5, targetPosition.current.z + 5]}
        intensity={0.9}
        color={fillLightColor.current}
      />
      {/* Subtle ambient light */}
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

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Convert mouse position to normalized coordinates (-1 to 1)
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    setMousePosition({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div className="h-screen w-full relative bg-[#0A0A1E]">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            camera={{ position: [0, 6, 8], fov: 45 }}
            className="h-full w-full"
          >
            <ScrollControls pages={4} damping={0.3}>
              <Scene mousePosition={mousePosition} />
            </ScrollControls>
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}