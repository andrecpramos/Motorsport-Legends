/**
 * CarCanvas — shared R3F Canvas wrapper used by all car scene components.
 * Encapsulates the invariant gl / dpr / shadows config so each scene only
 * declares what makes it unique (camera position, exposure, background, content).
 */
import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'

interface CarCanvasProps {
  /** Accessible label for the canvas region (role="img") */
  ariaLabel:           string
  /** Three-element camera position tuple — default [0, 1.2, 8.0] */
  cameraPosition?:     [number, number, number]
  /** ACES tone-mapping exposure — default 1.05 */
  toneMappingExposure?: number
  /** Canvas background CSS colour (also applied as fog base in SceneEnvironment) */
  background:          string
  children:            ReactNode
}

export function CarCanvas({
  ariaLabel,
  cameraPosition     = [0, 1.2, 8.0],
  toneMappingExposure = 1.05,
  background,
  children,
}: CarCanvasProps) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
    >
      <Canvas
        camera={{ position: cameraPosition, fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure,
        }}
        shadows
        style={{ width: '100%', height: '100%', background }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}
