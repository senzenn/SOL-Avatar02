"use client"

import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useChat } from "../hooks/useChat";
import { useAvatar } from "@/hooks/useAvatar";
import type { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    EyeLeft: THREE.SkinnedMesh & {
      morphTargetDictionary: { [key: string]: number };
      morphTargetInfluences: number[];
    };
    [key: string]: THREE.Object3D;
  };
  materials: { [key: string]: THREE.Material };
  scene: THREE.Group;
};

interface FacialExpression {
  [key: string]: number;
}

const facialExpressions: { [key: string]: FacialExpression } = {
  default: {},
  smile: {
    browInnerUp: 0.17,
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.44,
    noseSneerLeft: 0.1700000727403593,
    noseSneerRight: 0.14000002836874015,
    mouthPressLeft: 0.61,
    mouthPressRight: 0.41000000000000003,
  },
  funnyFace: {
    jawLeft: 0.63,
    mouthPucker: 0.53,
    noseSneerLeft: 1,
    noseSneerRight: 0.39,
    mouthLeft: 1,
    eyeLookUpLeft: 1,
    eyeLookUpRight: 1,
    cheekPuff: 0.9999924982764238,
    mouthDimpleLeft: 0.414743888682652,
    mouthRollLower: 0.32,
    mouthSmileLeft: 0.35499733688813034,
    mouthSmileRight: 0.35499733688813034,
  },
  sad: {
    mouthFrownLeft: 1,
    mouthFrownRight: 1,
    mouthShrugLower: 0.78341,
    browInnerUp: 0.452,
    eyeSquintLeft: 0.72,
    eyeSquintRight: 0.75,
    eyeLookDownLeft: 0.5,
    eyeLookDownRight: 0.5,
    jawForward: 1,
  },
  surprised: {
    eyeWideLeft: 0.5,
    eyeWideRight: 0.5,
    jawOpen: 0.351,
    mouthFunnel: 1,
    browInnerUp: 1,
  },
  angry: {
    browDownLeft: 1,
    browDownRight: 1,
    eyeSquintLeft: 1,
    eyeSquintRight: 1,
    jawForward: 1,
    jawLeft: 1,
    mouthShrugLower: 1,
    noseSneerLeft: 1,
    noseSneerRight: 0.42,
    eyeLookDownLeft: 0.16,
    eyeLookDownRight: 0.16,
    cheekSquintLeft: 1,
    cheekSquintRight: 1,
    mouthClose: 0.23,
    mouthFunnel: 0.63,
    mouthDimpleRight: 1,
  },
  crazy: {
    browInnerUp: 0.9,
    jawForward: 1,
    noseSneerLeft: 0.5700000000000001,
    noseSneerRight: 0.51,
    eyeLookDownLeft: 0.39435766259644545,
    eyeLookUpRight: 0.4039761421719682,
    eyeLookInLeft: 0.9618479575523053,
    eyeLookInRight: 0.9618479575523053,
    jawOpen: 0.9618479575523053,
    mouthDimpleLeft: 0.9618479575523053,
    mouthDimpleRight: 0.9618479575523053,
    mouthStretchLeft: 0.27893590769016857,
    mouthStretchRight: 0.2885543872656917,
    mouthSmileLeft: 0.5578718153803371,
    mouthSmileRight: 0.38473918302092225,
    tongueOut: 0.9618479575523053,
  },
};

const corresponding: { [key: string]: string } = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

const morphCombinations: { [key: string]: { [key: string]: number } } = {
  viseme_PP: {
    mouthPucker: 0.6,
    jawOpen: 0.2,
  },
  viseme_kk: {
    mouthClose: 0.4,
    jawOpen: 0.3,
    mouthStretchLeft: 0.3,
    mouthStretchRight: 0.3,
  },
  viseme_I: {
    mouthSmileLeft: 0.4,
    mouthSmileRight: 0.4,
    jawOpen: 0.4,
    mouthOpen: 0.3,
  },
  viseme_AA: {
    jawOpen: 0.7,
    mouthOpen: 0.6,
    mouthStretchLeft: 0.2,
    mouthStretchRight: 0.2,
  },
  viseme_O: {
    mouthFunnel: 0.6,
    jawOpen: 0.5,
    mouthOpen: 0.4,
  },
  viseme_U: {
    mouthPucker: 0.5,
    jawOpen: 0.4,
    mouthFunnel: 0.3,
  },
  viseme_FF: {
    mouthShrugUpper: 0.4,
    mouthPress: 0.3,
    jawOpen: 0.2,
  },
  viseme_TH: {
    mouthClose: 0.3,
    jawOpen: 0.25,
    tongueOut: 0.2,
  }
};

const morphLimits: { [key: string]: { min: number; max: number } } = {
  jawOpen: { min: 0, max: 1.0 },
  mouthOpen: { min: 0, max: 1.0 },
  mouthClose: { min: 0, max: 1.0 },
  mouthSmileLeft: { min: 0, max: 1.0 },
  mouthSmileRight: { min: 0, max: 1.0 },
  mouthFunnel: { min: 0, max: 1.0 },
  mouthPucker: { min: 0, max: 1.0 },
  mouthShrugUpper: { min: 0, max: 1.0 },
  mouthShrugLower: { min: 0, max: 1.0 },
  mouthPress: { min: 0, max: 1.0 },
  mouthStretchLeft: { min: 0, max: 1.0 },
  mouthStretchRight: { min: 0, max: 1.0 },
  tongueOut: { min: 0, max: 0.4 },
  viseme_PP: { min: 0, max: 1.0 },
  viseme_kk: { min: 0, max: 1.0 },
  viseme_I: { min: 0, max: 1.0 },
  viseme_AA: { min: 0, max: 1.0 },
  viseme_O: { min: 0, max: 1.0 },
  viseme_U: { min: 0, max: 1.0 },
  viseme_FF: { min: 0, max: 1.0 },
  viseme_TH: { min: 0, max: 1.0 },
};

const currentMorphValues: { [key: string]: number } = {};

let setupMode = false;

interface AvatarProps {
  [key: string]: any;
}

export function Avatar(props: AvatarProps) {
  const { avatarData } = useAvatar();
  console.log('🎭 Avatar Component - Loading model from:', avatarData?.modelPath);
  
  const modelPath = avatarData?.modelPath;
  if (!modelPath) {
    console.error('❌ Avatar Component - No model path available');
    return null;
  }

  console.log('🔄 Avatar Component - Loading GLB model:', modelPath);
  const { nodes, materials, scene } = useGLTF(modelPath) as GLTFResult;
  const { animations } = useGLTF("/models/animations.glb");

  const { message, onMessagePlayed, chat } = useChat();
  const [lipsync, setLipsync] = useState<any>();
  const group = useRef<THREE.Group>(null);
  const { actions, mixer } = useAnimations(animations, group);
  const [animation, setAnimation] = useState(
    animations.find((a) => a.name === "Idle") ? "Idle" : animations[0].name
  );
  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);
  const [facialExpression, setFacialExpression] = useState("");
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (nodes?.EyeLeft && !isInitialized) {
      console.log('✅ Avatar Component - Model loaded successfully');
      setIsLoaded(true);
      
      scene.traverse((child: any) => {
        if (child.morphTargetInfluences) {
          child.morphTargetInfluences.fill(0);
        }
      });

      const expressions = Object.keys(facialExpressions);
      const initialExpression = expressions[Math.floor(Math.random() * expressions.length)];
      setFacialExpression(initialExpression);

      const idleAction = actions["Idle"];
      if (idleAction) {
        idleAction.reset().fadeIn(0.5).play();
      }

      setIsInitialized(true);
    }
  }, [nodes, actions, scene, isInitialized]);

  useEffect(() => {
    if (!message) {
      setAnimation("Idle");
      return;
    }
    setAnimation(message.animation);
    setFacialExpression(message.facialExpression);
    setLipsync(message.lipsync);
    const audio = new Audio("data:audio/mp3;base64," + message.audio);
    audio.play();
    setAudio(audio);
    audio.onended = () => {
      onMessagePlayed();
      const expressions = Object.keys(facialExpressions);
      setFacialExpression(expressions[Math.floor(Math.random() * expressions.length)]);
    };
  }, [message, onMessagePlayed]);

  useEffect(() => {
    if (!actions || !animation) return;
    
    const action = actions[animation];
    if (action) {
      action.timeScale = 0.5;
      action.reset().fadeIn(1.0).play();
      return () => {
        action.fadeOut(1.0);
      };
    }
  }, [animation, actions]);

  const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
    if (!nodes?.EyeLeft) return;

    scene.traverse((child: any) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const combinations = morphCombinations[target] || { [target]: value };

        if (child.morphTargetDictionary[target] !== undefined) {
          const index = child.morphTargetDictionary[target];
          const limits = morphLimits[target] || { min: 0, max: 1 };
          const safeValue = Math.max(limits.min, Math.min(limits.max, value));

          if (currentMorphValues[target] === undefined) {
            currentMorphValues[target] = child.morphTargetInfluences[index];
          }

          currentMorphValues[target] = THREE.MathUtils.lerp(
            currentMorphValues[target],
            safeValue,
            speed
          );

          child.morphTargetInfluences[index] = currentMorphValues[target];
        }

        Object.entries(combinations).forEach(([morphName, morphValue]) => {
          const index = child.morphTargetDictionary[morphName];
          if (index === undefined || child.morphTargetInfluences[index] === undefined) {
            return;
          }

          const limits = morphLimits[morphName] || { min: 0, max: 1 };
          const safeValue = Math.max(limits.min, Math.min(limits.max, morphValue * value));

          if (currentMorphValues[morphName] === undefined) {
            currentMorphValues[morphName] = child.morphTargetInfluences[index];
          }

          currentMorphValues[morphName] = THREE.MathUtils.lerp(
            currentMorphValues[morphName],
            safeValue,
            speed
          );

          child.morphTargetInfluences[index] = currentMorphValues[morphName];
        });
      }
    });
  };

  useFrame((state, delta) => {
    if (!nodes?.EyeLeft || !isLoaded || !isInitialized) return;
    
    mixer.update(delta * 0.5);
    
    Object.keys(morphLimits).forEach((key) => {
      lerpMorphTarget(key, 0, delta * 2);
    });

    if (message && lipsync && audio) {
      const currentAudioTime = audio.currentTime;
      let foundValidCue = false;
      
      for (let i = 0; i < lipsync.mouthCues.length; i++) {
        const mouthCue = lipsync.mouthCues[i];
        if (
          currentAudioTime >= mouthCue.start &&
          currentAudioTime <= mouthCue.end
        ) {
          lerpMorphTarget('jawOpen', 0.4, delta * 8);
          lerpMorphTarget('mouthOpen', 0.3, delta * 8);
          
          const visemeTarget = corresponding[mouthCue.value];
          if (visemeTarget) {
            lerpMorphTarget(visemeTarget, 1.0, delta * 10);
            foundValidCue = true;
          }
          break;
        }
      }

      if (!foundValidCue) {
        Object.keys(morphLimits).forEach((key) => {
          lerpMorphTarget(key, 0, delta * 5);
        });
      }
    } else {
      Object.keys(morphLimits).forEach((key) => {
        lerpMorphTarget(key, 0, delta * 3);
      });
    }
  });

  useEffect(() => {
    return () => {};
  }, [message]);

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    return () => {};
  }, []);

  if (!isLoaded || !isInitialized || !nodes?.EyeLeft) {
    return null;
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/64f1a714fe61576b46f27ca2.glb");
useGLTF.preload("/models/animations.glb"); 