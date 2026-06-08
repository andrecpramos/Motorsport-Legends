import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { ACESFilmicToneMapping, Box3, Group, MathUtils, Vector3 } from 'three'

const BG = '#080705'

// 4-keyframe tour keyed to overall page scroll progress (0–1)
// hero → side profile → rear 3/4 → glamour front
const KEYFRAMES = [
  { progress: 0.00, carRotY: 0.45,  camZ: 7.5, camY: 1.20 },
  { progress: 0.30, carRotY: 1.57,  camZ: 5.2, camY: 0.55 },
  { progress: 0.65, carRotY: 2.95,  camZ: 7.2, camY: 1.10 },
  { progress: 1.00, carRotY: 3.80,  camZ: 7.0, camY: 1.05 },
]

function interpolate(progress: number) {
  const kf = KEYFRAMES
  let lo = kf[0]
  let hi = kf[kf.length - 1]
  for (let i = 0; i < kf.length - 1; i++) {
    if (progress >= kf[i].progress && progress <= kf[i + 1].progress) {
      lo = kf[i]; hi = kf[i + 1]; break
    }
  }
  const range = hi.progress - lo.progress
  const t = range === 0 ? 0 : (progress - lo.progress) / range
  const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  return {
    carRotY: MathUtils.lerp(lo.carRotY, hi.carRotY, ease),
    camZ:    MathUtils.lerp(lo.camZ,    hi.camZ,    ease),
    camY:    MathUtils.lerp(lo.camY,    hi.camY,    ease),
  }
}

interface MobileCarProps {
  progressRef: React.MutableRefObject<number>
}

function MobileCar({ progressRef }: MobileCarProps) {
  const { scene } = useGLTF('/models/gullwing.glb')
  const groupRef = useRef<Group>(null)
  const time = useRef(0)

  const currentRotY = useRef(0.45)
  const currentCamZ = useRef(7.5)
  const currentCamY = useRef(1.2)

  const { scale, yOffset } = (() => {
    const box = new Box3().setFromObject(scene)
    if (box.isEmpty()) return { scale: 1, yOffset: 0 }
    const size = box.getSize(new Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const s = maxDim > 0 ? 5.5 / maxDim : 1
    return { scale: s, yOffset: -box.min.y * s + 0.05 }
  })()

  useFrame((state, delta) => {
    time.current += delta
    const lerpFactor = 1 - Math.pow(0.06, delta)

    const target = interpolate(progressRef.current)

    currentRotY.current = MathUtils.lerp(currentRotY.current, target.carRotY, lerpFactor)
    currentCamZ.current = MathUtils.lerp(currentCamZ.current, target.camZ,    lerpFactor)
    currentCamY.current = MathUtils.lerp(currentCamY.current, target.camY,    lerpFactor)

    if (groupRef.current) {
      groupRef.current.rotation.y = currentRotY.current
      groupRef.current.rotation.z = Math.sin(time.current * 0.22) * 0.003
      groupRef.current.position.y = Math.sin(time.current * 0.45) * 0.006
    }

    state.camera.position.set(0, currentCamY.current, currentCamZ.current)
    state.camera.lookAt(0, 0.48, 0)
  })

  return (
    <group position={[-0.3, -0.3, 0]}>
      <group ref={groupRef}>
        <primitive object={scene} scale={scale} position-y={yOffset} />
      </group>
    </group>
  )
}

interface MobileCarSceneProps {
  progressRef: React.MutableRefObject<number>
}

export function MobileCarScene({ progressRef }: MobileCarSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 7.5], fov: 52, near: 0.1, far: 60 }}
      gl={{
        antialias: false,
        alpha: true,
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        powerPreference: 'low-power',
      }}
      dpr={Math.min(typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1, 1.5)}
      style={{ width: '100%', height: '100%', background: BG, pointerEvents: 'none', touchAction: 'none' }}
    >
      <color attach="background" args={[BG]} />

      <directionalLight position={[2, 10, 3]}  intensity={4.5} color="#ffffff" />
      <directionalLight position={[3, 0, 5]}   intensity={0.3}  color="#c89040" />
      <directionalLight position={[-7, 5, -3]} intensity={3.0}  color="#6080c8" />
      <directionalLight position={[7, 4, -4]}  intensity={2.0}  color="#8095bb" />
      <ambientLight intensity={0.05} />

      <Environment preset="warehouse" />

      <Suspense fallback={null}>
        <MobileCar progressRef={progressRef} />
      </Suspense>
    </Canvas>
  )
}
