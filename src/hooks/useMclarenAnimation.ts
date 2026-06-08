import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'
import { interpolateKeyframes } from '../lib/animationUtils'
import type { Keyframe } from '../types'

// McLaren F1 — 7-section scroll tour
// heritage 0.00–0.14  design 0.14–0.29  engine 0.29–0.44
// racing   0.44–0.58  legacy 0.58–0.72  stars  0.72–0.87  acquire 0.87–1.00
const KEYFRAMES: Keyframe[] = [
  // Heritage — sweeping front-right 3/4
  { progress: 0.00, carRotY:  0.40, carY: 0,    camZ: 5.2,  camY: 0.95, camX:  0.0 },
  { progress: 0.10, carRotY:  0.44, carY: 0.02, camZ: 4.8,  camY: 1.00, camX:  0.0 },
  // Design — right-side profile, close
  { progress: 0.20, carRotY:  1.57, carY: 0,    camZ: 2.8,  camY: 0.50, camX:  0.2 },
  { progress: 0.29, carRotY:  1.60, carY: 0,    camZ: 3.6,  camY: 0.72, camX:  0.0 },
  // Engine — front-left to show the rear-engine layout
  { progress: 0.36, carRotY: -0.70, carY: 0,    camZ: 3.2,  camY: 0.58, camX: -0.3 },
  { progress: 0.44, carRotY: -0.75, carY: 0,    camZ: 3.0,  camY: 0.54, camX: -0.2 },
  // Racing — dynamic overhead angle
  { progress: 0.50, carRotY:  0.55, carY: 0,    camZ: 4.2,  camY: 2.00, camX:  0.0 },
  { progress: 0.58, carRotY:  0.60, carY: 0,    camZ: 4.0,  camY: 1.90, camX:  0.1 },
  // Legacy — wide rear pull-back
  { progress: 0.64, carRotY:  3.10, carY: 0,    camZ: 6.5,  camY: 1.10, camX:  0.0 },
  { progress: 0.72, carRotY:  3.20, carY: 0,    camZ: 6.8,  camY: 1.15, camX:  0.0 },
  // Stars — elegant 3/4 rear
  { progress: 0.80, carRotY:  4.20, carY: 0,    camZ: 5.0,  camY: 1.00, camX: -0.5 },
  { progress: 0.87, carRotY:  4.30, carY: 0,    camZ: 5.2,  camY: 1.05, camX: -0.4 },
  // Acquire — front 3/4 final pose
  { progress: 0.93, carRotY:  6.60, carY: 0,    camZ: 5.0,  camY: 1.05, camX:  1.0 },
  { progress: 1.00, carRotY:  6.95, carY: 0,    camZ: 5.5,  camY: 1.10, camX:  1.3 },
]

const LOOKAT_Y: number[] = [
  0.44, 0.44,  // heritage
  0.40, 0.42,  // design
  0.44, 0.44,  // engine
  0.58, 0.56,  // racing (overhead)
  0.44, 0.44,  // legacy
  0.44, 0.44,  // stars
  0.52, 0.52,  // acquire
]


interface UseMclarenAnimationProps {
  progressRef:  React.MutableRefObject<number>
  carRef:       React.RefObject<Group | null>
  cameraTarget: React.MutableRefObject<{ x: number; y: number; z: number }>
}

export function useMclarenAnimation({ progressRef, carRef, cameraTarget }: UseMclarenAnimationProps) {
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const currentRotY  = useRef(0.40)
  const currentY     = useRef(0)
  const currentLookY = useRef(0.44)
  const time         = useRef(0)

  useFrame((state, delta) => {
    time.current += delta
    const lerpFactor = reducedMotion.current ? 1 : 1 - Math.pow(0.06, delta)
    const target = interpolateKeyframes(progressRef.current, KEYFRAMES, LOOKAT_Y)

    currentRotY.current  = MathUtils.lerp(currentRotY.current,  target.carRotY,  lerpFactor)
    currentY.current     = MathUtils.lerp(currentY.current,     target.carY,     lerpFactor)
    currentLookY.current = MathUtils.lerp(currentLookY.current, target.lookAtY,  lerpFactor)

    if (carRef.current) {
      carRef.current.rotation.y = currentRotY.current
      if (!reducedMotion.current) carRef.current.rotation.z = Math.sin(time.current * 0.22) * 0.003
      if (!reducedMotion.current) carRef.current.position.y = currentY.current + Math.sin(time.current * 0.45) * 0.006
    else carRef.current.position.y = currentY.current
    }

    cameraTarget.current.x = MathUtils.lerp(cameraTarget.current.x, target.camX, lerpFactor)
    cameraTarget.current.y = MathUtils.lerp(cameraTarget.current.y, target.camY, lerpFactor)
    cameraTarget.current.z = MathUtils.lerp(cameraTarget.current.z, target.camZ, lerpFactor)

    state.camera.position.set(cameraTarget.current.x, cameraTarget.current.y, cameraTarget.current.z)
    state.camera.lookAt(0, currentLookY.current, 0)
  })
}
