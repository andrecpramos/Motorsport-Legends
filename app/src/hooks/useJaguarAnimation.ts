import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'
import { interpolateKeyframes } from '../lib/animationUtils'
import type { Keyframe } from '../types'

// Jaguar E-Type — 6-section scroll tour
// heritage 0.00–0.17  design 0.17–0.36  engine 0.36–0.54
// racing   0.54–0.72  legacy 0.72–0.87  acquire 0.87–1.00
const KEYFRAMES: Keyframe[] = [
  // Heritage — low, wide front-right; camera set to respect the long bonnet
  { progress: 0.00, carRotY:  0.42, carY: 0,    camZ: 9.0,  camY: 1.05, camX:  0.0  },
  { progress: 0.10, carRotY:  0.45, carY: 0.02, camZ: 8.5,  camY: 1.08, camX:  0.0  },
  // Design — right-side profile at height to capture the long bonnet silhouette
  { progress: 0.22, carRotY:  1.57, carY: 0,    camZ: 5.0,  camY: 0.45, camX:  0.2  },
  { progress: 0.36, carRotY:  1.60, carY: 0,    camZ: 6.0,  camY: 0.75, camX:  0.0  },
  // Engine — front-left, show the bonnet and triple carbs
  { progress: 0.42, carRotY: -0.80, carY: 0,    camZ: 5.0,  camY: 0.60, camX: -0.3  },
  { progress: 0.54, carRotY: -0.84, carY: 0,    camZ: 4.8,  camY: 0.56, camX: -0.2  },
  // Racing — elevated rear 3/4, sense of speed
  { progress: 0.60, carRotY:  2.40, carY: 0,    camZ: 7.0,  camY: 1.50, camX: -0.2  },
  { progress: 0.72, carRotY:  2.50, carY: 0,    camZ: 6.8,  camY: 1.55, camX: -0.1  },
  // Legacy — wide glamour pull-back
  { progress: 0.76, carRotY:  3.05, carY: 0,    camZ: 11.0, camY: 1.10, camX:  0.0  },
  { progress: 0.87, carRotY:  3.18, carY: 0,    camZ: 11.5, camY: 1.15, camX:  0.0  },
  // Acquire — front-right final pose
  { progress: 0.92, carRotY:  6.55, carY: 0,    camZ: 8.5,  camY: 1.10, camX:  1.0  },
  { progress: 1.00, carRotY:  6.98, carY: 0,    camZ: 9.0,  camY: 1.10, camX:  1.3  },
]

const LOOKAT_Y: number[] = [
  0.42, 0.42,  // heritage
  0.38, 0.40,  // design
  0.42, 0.42,  // engine
  0.45, 0.46,  // racing (elevated rear)
  0.42, 0.42,  // legacy (wide pull)
  0.50, 0.50,  // acquire
]


interface UseJaguarAnimationProps {
  progressRef:  React.MutableRefObject<number>
  carRef:       React.RefObject<Group | null>
  cameraTarget: React.MutableRefObject<{ x: number; y: number; z: number }>
}

export function useJaguarAnimation({ progressRef, carRef, cameraTarget }: UseJaguarAnimationProps) {
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const currentRotY  = useRef(-0.15)
  const currentY     = useRef(0)
  const currentLookY = useRef(0.42)
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
