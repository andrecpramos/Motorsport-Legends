/**
 * materialUtils.ts — shared Three.js material and geometry helpers for car scenes.
 *
 * Extracted from the 6 car components where these were duplicated verbatim.
 */

import { Box3, DoubleSide, Mesh, MeshPhysicalMaterial, Object3D, Vector3 } from 'three'

// ─── Glass material factory ────────────────────────────────────────────────────

interface GlassOpts {
  /** Hex integer colour, default 0x88aacc */
  color?:           number
  /** 0–1, default 0.03 */
  roughness?:       number
  /** 0–1, default 0.85 */
  transmission?:    number
  /** Material thickness for refraction, default 0.3 */
  thickness?:       number
  /** 0–1, default 0.30 */
  opacity?:         number
  /** IBL intensity, default 2.0 */
  envMapIntensity?: number
}

export function createGlassMaterial(opts: GlassOpts = {}): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color:           opts.color           ?? 0x88aacc,
    metalness:       0,
    roughness:       opts.roughness       ?? 0.03,
    transmission:    opts.transmission    ?? 0.85,
    thickness:       opts.thickness       ?? 0.3,
    transparent:     true,
    opacity:         opts.opacity         ?? 0.30,
    envMapIntensity: opts.envMapIntensity ?? 2.0,
    side:            DoubleSide,
  })
}

// ─── Bounding-box scene fit ────────────────────────────────────────────────────

/**
 * Compute a uniform scale + yOffset so the scene's longest axis fits within
 * `targetSize` units and the bottom of the bounding box rests at y = 0.05.
 *
 * @param scene      Three.js Scene or Group from useGLTF
 * @param targetSize Desired size of the longest axis in world units
 * @param floorGap   Extra gap above the floor, default 0.05
 */
export function fitSceneToSize(
  scene:      Object3D,
  targetSize: number,
  floorGap    = 0.05,
): { scale: number; yOffset: number } {
  const box = new Box3()
  scene.traverse((c) => { if (c instanceof Mesh) box.expandByObject(c) })
  if (box.isEmpty()) return { scale: 1, yOffset: 0 }
  const size = box.getSize(new Vector3())
  const s    = targetSize / Math.max(size.x, size.y, size.z)
  return { scale: s, yOffset: -box.min.y * s + floorGap }
}
