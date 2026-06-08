import { useRef } from 'react'
import { Group } from 'three'
import { Porsche917kCar } from './Porsche917kCar'
import { SceneEnvironment, OrbitLight } from './Environment'
import { PostProcessing } from './PostProcessing'
import { usePorsche917kAnimation } from '../../hooks/usePorsche917kAnimation'
import { SceneLoadingOverlay } from './SceneLoadingOverlay'
import { CarCanvas } from './CarCanvas'

// Very dark warm black — pit-garage atmosphere
const BG = '#0b0905'

function SceneContent({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const carRef       = useRef<Group>(null)
  const cameraTarget = useRef({ x: 0.4, y: 0.80, z: 5.5 })

  usePorsche917kAnimation({ progressRef, carRef, cameraTarget })

  return (
    <>
      <color attach="background" args={[BG]} />

      <directionalLight
        position={[3, 9, 4]}
        intensity={5.5}
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
      <directionalLight position={[3, 0, 5]}   intensity={0.5}  color="#d09040" />
      <directionalLight position={[-8, 4, -3]} intensity={3.5}  color="#5070b8" />
      <directionalLight position={[8, 3, -4]}  intensity={2.8}  color="#8090b0" />
      <ambientLight intensity={0.04} color="#0b0905" />
      <pointLight position={[0, -0.1, 0]} color="#c88030" intensity={1.0} distance={8} />

      <OrbitLight color="#ffd080" intensity={6.0} speed={0.14} height={3.0} />
      <SceneEnvironment fogColor={BG} />
      <Porsche917kCar ref={carRef} progressRef={progressRef} />
      <PostProcessing />
    </>
  )
}

export function Porsche917kScene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <>
      <CarCanvas
        ariaLabel="Interactive 3D model of the Porsche 917K"
        cameraPosition={[0.4, 0.8, 5.5]}
        toneMappingExposure={1.10}
        background={BG}
      >
        <SceneContent progressRef={progressRef} />
      </CarCanvas>

      <SceneLoadingOverlay bg={BG} name="917K" accentRgb="190,165,75" />
    </>
  )
}
