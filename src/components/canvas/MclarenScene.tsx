import { useRef } from 'react'
import { Group } from 'three'
import { MclarenCar } from './MclarenCar'
import { SceneEnvironment, OrbitLight } from './Environment'
import { PostProcessing } from './PostProcessing'
import { useMclarenAnimation } from '../../hooks/useMclarenAnimation'
import { SceneLoadingOverlay } from './SceneLoadingOverlay'
import { CarCanvas } from './CarCanvas'

interface SceneContentProps {
  progressRef: React.MutableRefObject<number>
}

// Deep charcoal with warm orange undertone
const BG = '#0b0805'

function SceneContent({ progressRef }: SceneContentProps) {
  const carRef       = useRef<Group>(null)
  const cameraTarget = useRef({ x: 0, y: 2.4, z: 22.0 })

  useMclarenAnimation({ progressRef, carRef, cameraTarget })

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
      <directionalLight position={[3, 0, 5]}   intensity={0.4} color="#ff7020" />
      <directionalLight position={[-7, 5, -3]}  intensity={3.0} color="#6080c8" />
      <directionalLight position={[7, 4, -4]}   intensity={2.5} color="#8095bb" />
      <ambientLight intensity={0.05} color="#080705" />
      <pointLight position={[0, -0.1, 0]} color="#ff8020" intensity={0.9} distance={8} />

      <OrbitLight color="#ff8820" intensity={4.5} />
      <SceneEnvironment fogColor={BG} />
      <MclarenCar ref={carRef} progressRef={progressRef} />
      <PostProcessing />
    </>
  )
}

interface MclarenSceneProps {
  progressRef: React.MutableRefObject<number>
}

export function MclarenScene({ progressRef }: MclarenSceneProps) {
  return (
    <>
      <CarCanvas
        ariaLabel="Interactive 3D model of the McLaren F1"
        background={BG}
      >
        <SceneContent progressRef={progressRef} />
      </CarCanvas>

      <SceneLoadingOverlay bg={BG} name="F1" accentRgb="220,95,20" />
    </>
  )
}
