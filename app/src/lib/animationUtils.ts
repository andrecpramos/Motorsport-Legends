import { MathUtils } from 'three'
import type { Keyframe } from '../types'

/**
 * Interpolates between two keyframes based on scroll progress.
 * Shared by all six per-car animation hooks — do not duplicate.
 */
export function interpolateKeyframes(
  progress:    number,
  keyframes:   Keyframe[],
  lookAtTable: number[],
): { carRotY: number; carY: number; camZ: number; camY: number; camX: number; lookAtY: number } {
  let loIdx = 0
  let hiIdx = keyframes.length - 1

  for (let i = 0; i < keyframes.length - 1; i++) {
    if (progress >= keyframes[i].progress && progress <= keyframes[i + 1].progress) {
      loIdx = i
      hiIdx = i + 1
      break
    }
  }

  const lo    = keyframes[loIdx]
  const hi    = keyframes[hiIdx]
  const range = hi.progress - lo.progress
  const t     = range === 0 ? 0 : (progress - lo.progress) / range
  const ease  = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

  return {
    carRotY: MathUtils.lerp(lo.carRotY, hi.carRotY, ease),
    carY:    MathUtils.lerp(lo.carY,    hi.carY,    ease),
    camZ:    MathUtils.lerp(lo.camZ,    hi.camZ,    ease),
    camY:    MathUtils.lerp(lo.camY,    hi.camY,    ease),
    camX:    MathUtils.lerp(lo.camX,    hi.camX,    ease),
    lookAtY: MathUtils.lerp(lookAtTable[loIdx], lookAtTable[hiIdx], ease),
  }
}
