"use client"

import { Environment, OrbitControls, useAnimations, SpotLight, useDepthBuffer } from '@react-three/drei';
import { useAvatar } from '@/hooks/useAvatar';
import { Avatar } from './Avatar';
import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

interface ExperienceProps {
  currentAnimation?: "Talking_0" | "Talking_1" | "Talking_2" | "Crying" | "Laughing" | "Rumba" | "Idle" | "Terrified" | "Angry";
  currentExpression?: "smile" | "sad" | "angry" | "surprised" | "funnyFace" | "default";
  modelPath?: string;
  isCreateRoute?: boolean;
}

export function Experience({ 
  currentAnimation = "Idle",
  currentExpression = "default",
  modelPath,
  isCreateRoute = false
}: ExperienceProps) {
  const { avatarData } = useAvatar();
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const depthBuffer = useDepthBuffer({ frames: 1 });
  const [spotLightPosition] = useState(() => new THREE.Vector3(3, 3, 2));
  const spotLightRef = useRef<THREE.SpotLight>(null);

  // Initial animation
  useEffect(() => {
    const tl = gsap.timeline();

    if (groupRef.current) {
      // Reset position
      groupRef.current.position.y = -2;
      groupRef.current.rotation.y = Math.PI;

      // Entrance animation sequence
      tl.to(groupRef.current.position, {
        y: -1,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)"
      })
      .to(groupRef.current.rotation, {
        y: 0,
        duration: 2,
        ease: "power3.out"
      }, 0)
      .to(camera.position, {
        z: 5,
        duration: 2,
        ease: "power3.inOut"
      }, 0);
    }

    // Cleanup
    return () => {
      tl.kill();
    };
  }, [camera]);

  // Enhanced mouse move effect with spotlight following
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
      
      // Update spotlight position
      if (spotLightRef.current) {
        gsap.to(spotLightPosition, {
          x: x * 3,
          y: 3 + y * 0.5,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth rotation animation
  useFrame(() => {
    if (groupRef.current && isHovered) {
      targetRotation.current = {
        x: mousePosition.y * 0.2,
        y: mousePosition.x * 0.2
      };
    } else {
      targetRotation.current = {
        x: 0,
        y: 0
      };
    }

    // Smooth interpolation
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.1;
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.1;

    if (groupRef.current) {
      groupRef.current.rotation.x = currentRotation.current.x;
      groupRef.current.rotation.y = currentRotation.current.y;
    }
  });

  // Enhanced hover animations with light intensity
  const handlePointerEnter = () => {
    setIsHovered(true);
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: -0.9,
        duration: 0.3,
        ease: "power2.out"
      });
      // Enhance lighting on hover
      gsap.to(spotLightRef.current, {
        intensity: 2,
        distance: 8,
        duration: 0.3
      });
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: -1,
        duration: 0.3,
        ease: "power2.out"
      });
      // Reset lighting on leave
      gsap.to(spotLightRef.current, {
        intensity: 1.5,
        distance: 6,
        duration: 0.3
      });
    }
  };

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.2}
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
      
      <group 
        ref={groupRef} 
        position-y={-1}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {(modelPath || (avatarData && avatarData.modelPath)) && (
          <Avatar 
            modelPath={modelPath || (avatarData?.modelPath as string)} 
            currentAnimation={currentAnimation}
            currentExpression={currentExpression}
          />
        )}
      </group>

      {!isCreateRoute ? (
        // Full lighting setup for non-create routes
        <>
          <Environment preset="sunset" background blur={0.8} />
          
          <directionalLight
            castShadow
            position={[2, 3, 4]}
            intensity={1.2}
            shadow-normalBias={0.04}
            shadow-mapSize={[2048, 2048]}
            color="#ffd0b3"
          >
            <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
          </directionalLight>

          <directionalLight
            position={[-4, 2, -4]}
            intensity={0.4}
            color="#b3e0ff"
          />

          <directionalLight
            position={[0, 3, -3]}
            intensity={0.5}
            color="#ffe0cc"
          />

          <SpotLight
            ref={spotLightRef}
            position={[spotLightPosition.x, spotLightPosition.y, spotLightPosition.z]}
            intensity={1.5}
            distance={6}
            angle={0.5}
            attenuation={5}
            anglePower={4}
            depthBuffer={depthBuffer}
            color="#ffffff"
          />

          <ambientLight intensity={0.3} />
          <fog attach="fog" args={['#000000', 6, 20]} />
        </>
      ) : (
        // Simple lighting for create route
        <>
          <color attach="background" args={['#000000']} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
        </>
      )}
    </>
  );
} 