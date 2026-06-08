import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'
import { interpolateKeyframes } from '../lib/animationUtils'
import type { Keyframe } from '../types'

// Porsche 917K — 7-section scroll tour
// heritage 0.00–0.17  design 0.17–0.36  engine 0.36–0.54
// race     0.54–0.72  legacy 0.72–0.82  stars  0.82–0.91  acquire 0.91–1.00
const KEYFRAMES: Keyframe[] = [
  // Heritage — wide front 3/4, camera low to accentuate the flat racing body
  { progress: 0.00, carRotY:  0.50, carY: 0,    camZ: 5.5,  camY: 0.80, camX:  0.4 },
  { progress: 0.17, carRotY:  0.54, carY: 0.01, camZ: 5.2,  camY: 0.82, camX:  0.4 },
  // Design — pure side profile, very low so the aerodynamic body line dominates
  { progress: 0.24, carRotY:  1.57, carY: 0,    camZ: 4.0,  camY: 0.40, camX:  0.3 },
  { progress: 0.36, carRotY:  1.59, carY: 0,    camZ: 4.2,  camY: 0.42, camX:  0.2 },
  // Engine — rear 3/4, reveal the flat-12 engine cover
  { progress: 0.43, carRotY:  3.46, carY: 0,    camZ: 3.8,  camY: 0.62, camX: -0.3 },
  { progress: 0.54, carRotY:  3.50, carY: 0,    camZ: 4.0,  camY: 0.65, camX: -0.2 },
  // Race — steep overhead bird's eye showing the racing livery numbers
  { progress: 0.61, carRotY:  0.80, carY: 0,    camZ: 4.5,  camY: 3.50, camX:  0.0 },
  { progress: 0.72, carRotY:  0.84, carY: 0,    camZ: 4.8,  camY: 3.50, camX:  0.0 },
  // Legacy — wide cinematic pull-back
  { progress: 0.77, carRotY:  0.40, carY: 0,    camZ: 7.0,  camY: 1.20, camX:  0.6 },
  { progress: 0.82, carRotY:  0.38, carY: 0,    camZ: 7.2,  camY: 1.25, camX:  0.6 },
  // Stars — intimate right 3/4
  { progress: 0.87, carRotY:  1.10, carY: 0,    camZ: 4.8,  camY: 0.85, camX:  0.6 },
  { progress: 0.91, carRotY:  1.12, carY: 0,    camZ: 5.0,  camY: 0.88, camX:  0.5 },
  // Acquire — full frontal power shot
  { progress: 0.95, carRotY:  0.08, carY: 0,    camZ: 5.2,  camY: 0.82, camX:  0.0 },
  { progress: 1.00, carRotY:  0.06, carY: 0,    camZ: 5.4,  camY: 0.85, camX:  0.0 },
]

const LOOKAT_Y: number[] = [
  0.40, 0.40,  // heritage (low racing car)
  0.32, 0.32,  // design (very low profile)
  0.40, 0.40,  // engine
  0.48, 0.48,  // race (overhead looks down)
  0.40, 0.40,  // legacy
  0.40, 0.40,  // stars
  0.38, 0.38,  // acquire
]


interface UsePorsche917kAnimationProps {
  progressRef:  React.MutableRefObject<number>
  carRef:       React.RefObject<Group | null>
  cameraTarget: React.MutableRefObject<{ x: number; y: number; z: number }>
}

export function usePorsche917kAnimation({ progressRef, carRef, cameraTarget }: UsePorsche917kAnimationProps) {
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const currentRotY  = useRef(0.50)
  const currentY     = useRef(0)
  const currentLookY = useRef(0.40)  // matches heritage LOOKAT_Y[0]
  const time         = useRef(0)

  useFrame((state, delta) => {
    // Freeze the scene when a modal is open (body overflow hidden = scroll locked)
    if (document.body.style.overflow === 'hidden') return

    time.current += delta
    const lerpFactor = reducedMotion.current ? 1 : 1 - Math.pow(0.06, delta)
    const target = interpolateKeyframes(progressRef.current, KEYFRAMES, LOOKAT_Y)

    currentRotY.current  = MathUtils.lerp(currentRotY.current,  target.carRotY,  lerpFactor)
    currentY.current     = MathUtils.lerp(currentY.current,     target.carY,     lerpFactor)
    currentLookY.current = MathUtils.lerp(currentLookY.current, target.lookAtY,  lerpFactor)

    if (carRef.current) {
      carRef.current.rotation.y = currentRotY.current
      // Racing car breathes slightly — simulate track vibration
      if (!reducedMotion.current) carRef.current.rotation.z = Math.sin(time.current * 0.28) * 0.002
      if (!reducedMotion.current) carRef.current.position.y = currentY.current + Math.sin(time.current * 0.38) * 0.004
    else carRef.current.position.y = currentY.current
    }

    cameraTarget.current.x = MathUtils.lerp(cameraTarget.current.x, target.camX, lerpFactor)
    cameraTarget.current.y = MathUtils.lerp(cameraTarget.current.y, target.camY, lerpFactor)
    cameraTarget.current.z = MathUtils.lerp(cameraTarget.current.z, target.camZ, lerpFactor)

    state.camera.position.set(cameraTarget.current.x, cameraTarget.current.y, cameraTarget.current.z)
    state.camera.lookAt(0, currentLookY.current, 0)
  })
}
