import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'
import { interpolateKeyframes } from '../lib/animationUtils'
import type { Keyframe } from '../types'

// Ferrari 250 GTO — 6-section scroll tour
// heritage 0.00–0.17  design 0.17–0.36  engine 0.36–0.54
// racing   0.54–0.72  legacy 0.72–0.87  acquire 0.87–1.00
const KEYFRAMES: Keyframe[] = [
  // Heritage — elegant front-right 3/4 entrance
  { progress: 0.00, carRotY:  0.45, carY: 0,    camZ: 8.0,  camY: 1.15, camX:  0.0  },
  { progress: 0.10, carRotY:  0.48, carY: 0.02, camZ: 7.6,  camY: 1.20, camX:  0.0  },
  // Design — true right-side profile, camera tightens
  { progress: 0.22, carRotY:  1.57, carY: 0,    camZ: 4.2,  camY: 0.52, camX:  0.2  },
  { progress: 0.36, carRotY:  1.60, carY: 0,    camZ: 5.5,  camY: 0.80, camX:  0.0  },
  // Engine — front-left to show bonnet and intakes
  { progress: 0.42, carRotY: -0.78, carY: 0,    camZ: 4.6,  camY: 0.65, camX: -0.3  },
  { progress: 0.54, carRotY: -0.82, carY: 0,    camZ: 4.4,  camY: 0.60, camX: -0.2  },
  // Racing — dynamic angled overhead, race stance
  { progress: 0.60, carRotY:  0.60, carY: 0,    camZ: 5.8,  camY: 1.90, camX:  0.0  },
  { progress: 0.72, carRotY:  0.62, carY: 0,    camZ: 5.5,  camY: 1.95, camX:  0.1  },
  // Legacy — wide dramatic pull-back revealing the rear
  { progress: 0.76, carRotY:  3.00, carY: 0,    camZ: 9.5,  camY: 1.20, camX:  0.0  },
  { progress: 0.87, carRotY:  3.15, carY: 0,    camZ: 10.0, camY: 1.25, camX:  0.0  },
  // Acquire — elegant final pose front-right
  { progress: 0.92, carRotY:  6.55, carY: 0,    camZ: 7.8,  camY: 1.20, camX:  1.1  },
  { progress: 1.00, carRotY:  6.98, carY: 0,    camZ: 8.5,  camY: 1.20, camX:  1.4  },
]

const LOOKAT_Y: number[] = [
  0.44, 0.44,  // heritage
  0.40, 0.42,  // design
  0.44, 0.44,  // engine
  0.55, 0.56,  // racing (overhead)
  0.44, 0.44,  // legacy (rear)
  0.52, 0.52,  // acquire
]


interface UseFerrariAnimationProps {
  progressRef:  React.MutableRefObject<number>
  carRef:       React.RefObject<Group | null>
  cameraTarget: React.MutableRefObject<{ x: number; y: number; z: number }>
}

export function useFerrariAnimation({ progressRef, carRef, cameraTarget }: UseFerrariAnimationProps) {
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const currentRotY  = useRef(-0.15)
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
