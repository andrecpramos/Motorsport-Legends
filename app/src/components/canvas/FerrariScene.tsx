import { useRef } from 'react'
import { Group } from 'three'
import { FerrariCar } from './FerrariCar'
import { SceneEnvironment, OrbitLight } from './Environment'
import { PostProcessing } from './PostProcessing'
import { useFerrariAnimation } from '../../hooks/useFerrariAnimation'
import { SceneLoadingOverlay } from './SceneLoadingOverlay'
import { CarCanvas } from './CarCanvas'

interface SceneContentProps {
  progressRef: React.MutableRefObject<number>
}

// Deep crimson-black — gives the canvas a Ferrari personality
const BG = '#0f0303'

function SceneContent({ progressRef }: SceneContentProps) {
  const carRef      = useRef<Group>(null)
  const cameraTarget = useRef({ x: 0, y: 2.4, z: 22.0 })

  useFerrariAnimation({ progressRef, carRef, cameraTarget })

  return (
    <>
      <color attach="background" args={[BG]} />

      <directionalLight
        position={[2, 10, 3]}
        intensity={5.0}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[3, 0, 5]}   intensity={0.3} color="#c89040" />
      <directionalLight position={[-7, 5, -3]}  intensity={3.5} color="#6080c8" />
      <directionalLight position={[7, 4, -4]}   intensity={2.5} color="#8095bb" />
      <ambientLight intensity={0.05} color="#080705" />
      <pointLight position={[0, -0.1, 0]} color="#c89040" intensity={0.8} distance={8} />

      <OrbitLight />
      <SceneEnvironment fogColor="#0f0303" />
      <FerrariCar ref={carRef} progressRef={progressRef} />
      <PostProcessing />
    </>
  )
}

interface FerrariSceneProps {
  progressRef: React.MutableRefObject<number>
}

export function FerrariScene({ progressRef }: FerrariSceneProps) {
  return (
    <>
      <CarCanvas
        ariaLabel="Interactive 3D model of the Ferrari 250 GTO"
        background={BG}
      >
        <SceneContent progressRef={progressRef} />
      </CarCanvas>

      <SceneLoadingOverlay bg={BG} name="250 GTO" accentRgb="176,28,20" />
    </>
  )
}
