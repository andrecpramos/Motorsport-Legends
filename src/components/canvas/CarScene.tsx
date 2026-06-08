import { useRef } from 'react'
import { Group } from 'three'
import { GullwingCar } from './GullwingCar'
import { SceneEnvironment, OrbitLight } from './Environment'
import { PostProcessing } from './PostProcessing'
import { useCarAnimation } from '../../hooks/useCarAnimation'
import { SceneLoadingOverlay } from './SceneLoadingOverlay'
import { CarCanvas } from './CarCanvas'

interface SceneContentProps {
  progressRef: React.MutableRefObject<number>
}

const BG = '#080705'

function SceneContent({ progressRef }: SceneContentProps) {
  const carRef = useRef<Group>(null)
  // Start far back — the cinematic lerp naturally drives both camera and car
  // rotation to their first keyframe values, creating an "approaching" intro.
  const cameraTarget = useRef({ x: 0, y: 2.4, z: 22.0 })

  useCarAnimation({ progressRef, carRef, cameraTarget })

  return (
    <>
      <color attach="background" args={[BG]} />

      {/* Key light — tight overhead showroom spot */}
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

      {/* Warm fill — just enough to lift shadow detail */}
      <directionalLight position={[3, 0, 5]} intensity={0.3} color="#c89040" />

      {/* Cold rim left — dramatic edge separation */}
      <directionalLight position={[-7, 5, -3]} intensity={3.5} color="#6080c8" />

      {/* Cold rim right */}
      <directionalLight position={[7, 4, -4]} intensity={2.5} color="#8095bb" />

      {/* Ambient — near zero, keep the showroom drama */}
      <ambientLight intensity={0.05} color="#080705" />

      {/* Under-car warm catch light — simulates floor bounce */}
      <pointLight position={[0, -0.1, 0]} color="#c89040" intensity={0.8} distance={8} />

      <OrbitLight />
      <SceneEnvironment />
      <GullwingCar ref={carRef} progressRef={progressRef} />
      <PostProcessing />
    </>
  )
}

interface CarSceneProps {
  progressRef: React.MutableRefObject<number>
}

export function CarScene({ progressRef }: CarSceneProps) {
  return (
    <>
      <CarCanvas
        ariaLabel="Interactive 3D model of the Mercedes-Benz 300 SL Gullwing"
        background={BG}
      >
        <SceneContent progressRef={progressRef} />
      </CarCanvas>

      <SceneLoadingOverlay bg={BG} name="300 SL" accentRgb="176,148,90" />
    </>
  )
}
