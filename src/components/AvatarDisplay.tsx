import { useRef, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useStore } from '@/lib/store'
import { useAvatarInteraction } from '@/hooks/useAvatarInteraction'
import * as THREE from 'three'

interface AvatarModelProps {
  modelUrl: string
  lipSync?: boolean
  animations?: boolean
}

function AvatarModel({ modelUrl, lipSync, animations }: AvatarModelProps) {
  const { scene } = useGLTF(modelUrl)
  const meshRef = useRef<THREE.Mesh | null>(null)
  
  useEffect(() => {
    if (scene) {
      // Find the head/face mesh
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh && object.morphTargetDictionary) {
          meshRef.current = object

          // Reset all morph targets to 0 to ensure neutral expression
          if (object.morphTargetInfluences) {
            object.morphTargetInfluences.fill(0)
          }

          // Disable automatic morphing
          object.morphTargetInfluences?.forEach((_, index) => {
            object.morphTargetInfluences![index] = 0
          })

          // Log available morph targets for debugging
          console.log('Available morph targets:', Object.keys(object.morphTargetDictionary))
        }
      })
    }

    // Cleanup function
    return () => {
      if (meshRef.current?.morphTargetInfluences) {
        meshRef.current.morphTargetInfluences.fill(0)
      }
    }
  }, [scene])

  // Prevent any automatic updates to morph targets
  useEffect(() => {
    const mesh = meshRef.current
    if (mesh) {
      const originalUpdateMorphTargets = mesh.updateMorphTargets
      mesh.updateMorphTargets = () => {
        // Do nothing - prevent automatic updates
      }

      return () => {
        mesh.updateMorphTargets = originalUpdateMorphTargets
      }
    }
  }, [])

  // Only update expressions when explicitly triggered
  const updateExpression = (expressionName: string, value: number) => {
    if (meshRef.current?.morphTargetDictionary) {
      const index = meshRef.current.morphTargetDictionary[expressionName]
      if (index !== undefined && meshRef.current.morphTargetInfluences) {
        meshRef.current.morphTargetInfluences[index] = value
      }
    }
  }

  // Handle lip sync if enabled
  useEffect(() => {
    if (lipSync && meshRef.current) {
      // Reset mouth-related morph targets
      const mouthTargets = ['mouthOpen', 'mouthSmile', 'mouthShrugUpper', 'mouthShrugLower']
      mouthTargets.forEach(target => updateExpression(target, 0))
    }
  }, [lipSync])

  return (
    <group position={[0, -1, 0]}>
      <primitive object={scene} scale={1.5} />
    </group>
  )
}

interface AvatarDisplayProps {
  className?: string
  features?: {
    chat?: boolean
    lipSync?: boolean
    animations?: boolean
  }
}

export function AvatarDisplay({ 
  className = '', 
  features = { 
    chat: true, 
    lipSync: true, 
    animations: true 
  } 
}: AvatarDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { avatar, isProcessing, error } = useStore()
  const { processUserInput, stopSpeaking } = useAvatarInteraction()

  const handleUserInput = async (input: string) => {
    if (!features.chat) return
    await processUserInput(input)
  }

  return (
    <div ref={containerRef} className={`relative w-full h-full min-h-[400px] ${className}`}>
      {/* 3D Avatar Canvas */}
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
        <Suspense fallback={null}>
          <AvatarModel 
            modelUrl={avatar.currentModel}
            lipSync={features.lipSync}
            animations={features.animations}
          />
        </Suspense>
      </Canvas>

      {/* Loading Indicator */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute bottom-20 left-4 right-4 bg-red-500 text-white p-2 rounded">
          {error}
        </div>
      )}

      {/* Input Interface - Only show if chat is enabled */}
      {features.chat && (
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const input = e.currentTarget.value.trim()
                if (input) {
                  handleUserInput(input)
                  e.currentTarget.value = ''
                }
              }
            }}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => stopSpeaking()}
          >
            Stop
          </button>
        </div>
      )}
    </div>
  )
} 