import { useEffect, useMemo, useRef, useState, forwardRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Box3, DoubleSide, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three'
import { createGlassMaterial } from '../../lib/materialUtils'
import { GULLWING_HOTSPOTS } from '../../constants/hotspots'
import { CarHotspot } from './CarHotspot'
import { SECTIONS } from '../../constants/sections'
import { getActiveSectionId } from '../../hooks/useCarPage'

useGLTF.preload('/models/gullwing.glb')

interface GullwingCarProps {
  progressRef: React.MutableRefObject<number>
}

export const GullwingCar = forwardRef<Group, GullwingCarProps>(
  function GullwingCar({ progressRef }, ref) {
    const { scene } = useGLTF('/models/gullwing.glb')

    // Track active section for hotspot visibility — guarded to avoid excess re-renders
    const [activeSection, setActiveSection] = useState('heritage')
    const prevSection = useRef('heritage')
    useFrame(() => {
      const next = getActiveSectionId(SECTIONS, progressRef.current)
      if (next !== prevSection.current) {
        prevSection.current = next
        setActiveSection(next)
      }
    })

    // Only glass needs a full override — GLTF glass materials lack transmission.
    // All other materials keep their original GLTF colours; we only enhance
    // the PBR properties (metalness, roughness, envMapIntensity) so the bodywork
    // reads correctly under the showroom lighting.
    const glassMat = useMemo(() => createGlassMaterial({ roughness: 0.02, opacity: 0.32 }), [])

    // ── Scale + ground lift ────────────────────────────────────────────────
    const isShadowCatcher = (s: Vector3) =>
      s.y < 0.005 * Math.max(s.x, s.z) && Math.max(s.x, s.z) > 3.0

    const { scale, yOffset } = useMemo(() => {
      const realBox = new Box3()

      scene.traverse((child) => {
        if (!(child instanceof Mesh)) return
        const b = new Box3().setFromObject(child)
        const s = b.getSize(new Vector3())
        if (isShadowCatcher(s)) return
        realBox.expandByObject(child)
      })

      if (realBox.isEmpty()) return { scale: 1, yOffset: 0 }

      const size   = realBox.getSize(new Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const s      = maxDim > 0 ? 5.5 / maxDim : 1
      return { scale: s, yOffset: -realBox.min.y * s + 0.05 }
    }, [scene])

    // ── Door node identification (debug) ────────────────────────────────────
    // ── Material enhancement ───────────────────────────────────────────────
    // Preserve original GLTF colours; tune PBR properties per material role.
    useEffect(() => {
      scene.traverse((child) => {
        if (!(child instanceof Mesh)) return
        child.castShadow    = true
        child.receiveShadow = false

        const b = new Box3().setFromObject(child)
        const s = b.getSize(new Vector3())
        if (isShadowCatcher(s)) {
          child.visible = false
          return
        }

        const name = (Array.isArray(child.material)
          ? child.material[0]?.name
          : child.material?.name
        ) ?? ''

        // Glass — full override (original has no transmission)
        if (name === 'Material' || name === 'Material.004') {
          child.material = glassMat
          return
        }

        // All other materials: enhance in-place, keep original colour
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        for (const mat of mats) {
          if (!(mat instanceof MeshStandardMaterial)) continue

          mat.side             = DoubleSide
          mat.envMapIntensity  = 2.0

          if (name === 'chrome' || name === 'Material.007') {
            // Bright chrome trim
            mat.metalness = 0.96
            mat.roughness = 0.04
            mat.envMapIntensity = 3.2
          } else if (name === 'mid-chrome') {
            mat.metalness = 0.88
            mat.roughness = 0.12
            mat.envMapIntensity = 2.6
          } else if (name === 'main_color' || name === 'Material.001') {
            // Body panels — keep original colour, increase metalness for showroom sheen
            mat.metalness = 0.82
            mat.roughness = 0.20
            mat.envMapIntensity = 2.2
          } else if (name === 'tire') {
            mat.metalness = 0.0
            mat.roughness = 0.92
            mat.envMapIntensity = 0.1
          } else if (name === 'black' || name === 'material') {
            mat.metalness = 0.15
            mat.roughness = 0.85
          } else if (name === 'Material.003' || name === 'Material.005') {
            // Tail lights — warm emissive glow
            mat.roughness          = 0.05
            mat.emissiveIntensity  = 0.5
          } else if (name === 'Material.006') {
            // Exhaust — patinated metal
            mat.metalness = 0.72
            mat.roughness = 0.34
          }

          mat.needsUpdate = true
        }
      })
    }, [scene, glassMat])

    return (
      <group position={[-0.55, 0, 0]}>
        {/* ref group — animated by useCarAnimation (Y position + rotations only) */}
        <group ref={ref}>
          <primitive object={scene} scale={scale} position-y={yOffset} />

          {/* 3D hotspots — rendered in the same local space as the animated car */}
          {GULLWING_HOTSPOTS.map(hotspot => (
            <CarHotspot
              key={hotspot.id}
              hotspot={hotspot}
              visible={hotspot.sections.includes(activeSection)}
            />
          ))}
        </group>
      </group>
    )
  }
)
