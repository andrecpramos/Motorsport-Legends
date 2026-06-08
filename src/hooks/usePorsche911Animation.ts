import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'
import { interpolateKeyframes } from '../lib/animationUtils'
import type { Keyframe } from '../types'

// Porsche 911 Urmodell — 7-section scroll tour
// heritage 0.00–0.17  design 0.17–0.36  engine 0.36–0.54
// lineage  0.54–0.72  legacy 0.72–0.82  stars  0.82–0.91  acquire 0.91–1.00
const KEYFRAMES: Keyframe[] = [
  // Heritage — front-right 3/4, medium distance so full silhouette reads clearly
  { progress: 0.00, carRotY:  0.45, carY: 0,    camZ: 5.0,  camY: 1.00, camX:  0.2 },
  { progress: 0.17, carRotY:  0.50, carY: 0.01, camZ: 4.8,  camY: 1.02, camX:  0.2 },
  // Design — right-side profile, close enough to see the silhouette line
  { progress: 0.24, carRotY:  1.55, carY: 0,    camZ: 4.0,  camY: 0.55, camX:  0.3 },
  { progress: 0.36, carRotY:  1.58, carY: 0,    camZ: 4.2,  camY: 0.58, camX:  0.1 },
  // Engine — rear 3/4, reveal the rear-engine layout
  { progress: 0.43, carRotY:  3.50, carY: 0,    camZ: 3.8,  camY: 0.68, camX: -0.2 },
  { progress: 0.54, carRotY:  3.54, carY: 0,    camZ: 4.0,  camY: 0.70, camX: -0.1 },
  // Lineage — gently overhead, contemplative mid-distance
  { progress: 0.61, carRotY:  2.20, carY: 0,    camZ: 5.0,  camY: 1.80, camX:  0.0 },
  { progress: 0.72, carRotY:  2.28, carY: 0,    camZ: 5.2,  camY: 1.85, camX:  0.0 },
  // Legacy — wide dramatic pull-back
  { progress: 0.77, carRotY:  0.30, carY: 0,    camZ: 6.5,  camY: 0.85, camX:  0.5 },
  { progress: 0.82, carRotY:  0.28, carY: 0,    camZ: 6.8,  camY: 0.88, camX:  0.5 },
  // Stars — elegant left 3/4
  { progress: 0.87, carRotY: -0.42, carY: 0,    camZ: 5.0,  camY: 0.95, camX: -0.5 },
  { progress: 0.91, carRotY: -0.40, carY: 0,    camZ: 5.2,  camY: 1.00, camX: -0.4 },
  // Acquire — front 3/4 final pose
  { progress: 0.95, carRotY:  0.55, carY: 0,    camZ: 5.0,  camY: 0.95, camX:  0.8 },
  { progress: 1.00, carRotY:  0.58, carY: 0,    camZ: 5.2,  camY: 1.00, camX:  1.0 },
]

const LOOKAT_Y: number[] = [
  0.45, 0.45,  // heritage
  0.40, 0.42,  // design
  0.48, 0.48,  // engine (rear)
  0.55, 0.55,  // lineage (overhead)
  0.42, 0.42,  // legacy
  0.44, 0.44,  // stars
  0.46, 0.46,  // acquire
]


interface UsePorsche911AnimationProps {
  progressRef:  React.MutableRefObject<number>
  carRef:       React.RefObject<Group | null>
  cameraTarget: React.MutableRefObject<{ x: number; y: number; z: number }>
}

export function usePorsche911Animation({ progressRef, carRef, cameraTarget }: UsePorsche911AnimationProps) {
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const currentRotY  = useRef(0.45)
  const currentY     = useRef(0)
  const currentLookY = useRef(0.45)
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
      if (!reducedMotion.current) carRef.current.rotation.z = Math.sin(time.current * 0.20) * 0.003
      if (!reducedMotion.current) carRef.current.position.y = currentY.current + Math.sin(time.current * 0.42) * 0.006
    else carRef.current.position.y = currentY.current
    }

    cameraTarget.current.x = MathUtils.lerp(cameraTarget.current.x, target.camX, lerpFactor)
    cameraTarget.current.y = MathUtils.lerp(cameraTarget.current.y, target.camY, lerpFactor)
    cameraTarget.current.z = MathUtils.lerp(cameraTarget.current.z, target.camZ, lerpFactor)

    state.camera.position.set(cameraTarget.current.x, cameraTarget.current.y, cameraTarget.current.z)
    state.camera.lookAt(0, currentLookY.current, 0)
  })
}
