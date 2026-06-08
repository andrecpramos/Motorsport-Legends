import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'
import { interpolateKeyframes } from '../lib/animationUtils'
import type { Keyframe } from '../types'

// Car dimensions after Center-bottom + scale=1.385:
//   Y: 0 → 1.16 (floor to roof)   wheel axle ≈ 0.32   mid ≈ 0.58
//   Z: −2.1 → +2.1  (front = +Z)
//   X: −0.83 → +0.83
//
// Section progress ranges (2000vh):
//   heritage  0.00–0.13  design  0.13–0.27  engine   0.27–0.42
//   doors     0.42–0.56  interior 0.56–0.70  legacy   0.70–0.82
//   stars     0.82–0.91  acquire  0.91–1.00

// Rotation tour — car completes a full ~360° forward sweep across the scroll:
//   Heritage  0.45  → front-right 3/4        (classic first impression)
//   Design    1.57  → true right-side profile  (sculptural bodywork)
//   Engine   −0.85  → front-left 3/4          (short backward cut to show grille/hood)
//   Doors     0.55  → overhead roofline        (elevation matters here, not rotation)
//   Interior  1.05  → driver-side overhead     (cockpit close-up)
//   Legacy    2.95  → rear 3/4 → full rear     (camera pulls back, car spins to reveal tail)
//   Stars     4.65  → left-side profile        (mirror of design — never seen before)
//   Acquire   7.00  → ≡ 0.72 front-right 3/4  (full circle complete, glamour finale)
const KEYFRAMES: Keyframe[] = [
  // Heritage — wide 3/4 front-right, elegant entrance
  { progress: 0.00, carRotY: 0.45,  carY: 0,    camZ: 8.0,  camY: 1.2,  camX:  0.0  },
  { progress: 0.07, carRotY: 0.48,  carY: 0.03, camZ: 7.8,  camY: 1.25, camX:  0.0  },
  // Design — true right-side profile (push past 80° to full 90°)
  { progress: 0.16, carRotY: 1.57,  carY: 0,    camZ: 4.0,  camY: 0.48, camX:  0.2  },
  // Camera pulls back so the cut backward to engine doesn't clip through the body
  { progress: 0.27, carRotY: 1.60,  carY: 0,    camZ: 5.8,  camY: 0.85, camX:  0.0  },
  // Engine — front-left (short backward cut: ~145° reverse shows the grille/hood face)
  { progress: 0.31, carRotY: -0.85, carY: 0,    camZ: 4.8,  camY: 0.65, camX: -0.3  },
  { progress: 0.42, carRotY: -0.90, carY: 0,    camZ: 4.6,  camY: 0.60, camX: -0.2  },
  // Doors — elevated overhead, roofline silhouette
  { progress: 0.46, carRotY: 0.55,  carY: 0,    camZ: 5.2,  camY: 2.0,  camX:  0.0  },
  { progress: 0.56, carRotY: 0.55,  carY: 0,    camZ: 5.0,  camY: 2.1,  camX:  0.0  },
  // Interior — tight overhead cockpit, driver side
  { progress: 0.60, carRotY: 1.05,  carY: 0.08, camZ: 3.2,  camY: 1.80, camX: -0.4  },
  { progress: 0.70, carRotY: 1.00,  carY: 0.06, camZ: 3.4,  camY: 1.70, camX: -0.3  },
  // Legacy — camera pulls way back while car sweeps forward to reveal the REAR (never seen before)
  { progress: 0.73, carRotY: 2.20,  carY: 0,    camZ: 8.0,  camY: 1.15, camX: -0.2  },
  { progress: 0.82, carRotY: 2.95,  carY: 0,    camZ: 9.0,  camY: 1.2,  camX:  0.0  },
  // Stars — left-side profile (mirror of design, equally never-seen angle)
  { progress: 0.85, carRotY: 4.10,  carY: 0,    camZ: 8.0,  camY: 0.90, camX: -0.4  },
  { progress: 0.91, carRotY: 4.65,  carY: 0,    camZ: 6.8,  camY: 0.75, camX: -0.3  },
  // Acquire — forward rotation lands on ≡ 0.72 front-right (7.00 = 0.72 + 2π), full circle
  { progress: 0.94, carRotY: 6.60,  carY: 0,    camZ: 7.8,  camY: 1.2,  camX:  1.2  },
  { progress: 1.00, carRotY: 7.00,  carY: 0,    camZ: 8.5,  camY: 1.2,  camX:  1.5  },
]

const LOOKAT_Y: number[] = [
  0.45, 0.45,  // heritage
  0.42, 0.42,  // design
  0.44, 0.44,  // engine
  0.55, 0.58,  // doors
  0.60, 0.58,  // interior
  0.44, 0.44,  // legacy (rear — look at centre height)
  0.42, 0.42,  // stars (left profile — match design height)
  0.52, 0.52,  // acquire
]


interface UseCarAnimationProps {
  progressRef: React.MutableRefObject<number>
  carRef:      React.RefObject<Group | null>
  cameraTarget: React.MutableRefObject<{ x: number; y: number; z: number }>
}

export function useCarAnimation({ progressRef, carRef, cameraTarget }: UseCarAnimationProps) {
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  // Start the car slightly off-angle and the camera far back so both
  // cinematically arrive at the first keyframe — giving the feel of the
  // car rolling to a stop in the showroom.
  const currentRotY  = useRef(-0.15)
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
      if (!reducedMotion.current) carRef.current.rotation.z = Math.sin(time.current * 0.22) * 0.003  // barely perceptible sway
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
