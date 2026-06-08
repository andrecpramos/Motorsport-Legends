import { useRef } from 'react'
import { Group } from 'three'
import { Porsche911Car } from './Porsche911Car'
import { SceneEnvironment, OrbitLight } from './Environment'
import { PostProcessing } from './PostProcessing'
import { usePorsche911Animation } from '../../hooks/usePorsche911Animation'
import { SceneLoadingOverlay } from './SceneLoadingOverlay'
import { CarCanvas } from './CarCanvas'

// Warm near-black with slight cool tone — classic Porsche workshop
const BG = '#0a0a0c'

function SceneContent({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const carRef       = useRef<Group>(null)
  const cameraTarget = useRef({ x: 0.2, y: 1.0, z: 5.0 })

  usePorsche911Animation({ progressRef, carRef, cameraTarget })

  return (
    <>
      <color attach="background" args={[BG]} />

      <directionalLight
        position={[2, 10, 4]}
        intensity={4.5}
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
      <directionalLight position={[4, 1, 5]}   intensity={0.4}  color="#d8c890" />
      <directionalLight position={[-8, 5, -4]} intensity={3.0}  color="#7090cc" />
      <directionalLight position={[8, 4, -5]}  intensity={2.2}  color="#90a8c8" />
      <ambientLight intensity={0.06} color="#0a0a0c" />
      <pointLight position={[0, -0.1, 0]} color="#c8b880" intensity={0.7} distance={7} />

      <OrbitLight color="#f0e8d0" intensity={4.5} distance={30} speed={0.10} height={4.0} radius={10} />
      <SceneEnvironment fogColor={BG} />
      <Porsche911Car ref={carRef} progressRef={progressRef} />
      <PostProcessing />
    </>
  )
}

export function Porsche911Scene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <>
      <CarCanvas
        ariaLabel="Interactive 3D model of the Porsche 911"
        cameraPosition={[0.2, 1.0, 5.0]}
        toneMappingExposure={1.08}
        background={BG}
      >
        <SceneContent progressRef={progressRef} />
      </CarCanvas>

      <SceneLoadingOverlay bg={BG} name="911" accentRgb="185,165,125" />
    </>
  )
}
