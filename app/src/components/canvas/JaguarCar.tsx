import { useEffect, useMemo, useRef, useState, forwardRef } from 'react'
import { useGLTF } from '../../lib/gltf'
import { useFrame } from '@react-three/fiber'
import { DoubleSide, Group, Mesh, MeshStandardMaterial, Object3D } from 'three'
import { createGlassMaterial, fitSceneToSize } from '../../lib/materialUtils'
import { JAGUAR_HOTSPOTS } from '../../constants/hotspots'
import { CarHotspot } from './CarHotspot'
import { JAGUAR_SECTIONS } from '../../constants/jaguarSections'
import { getActiveSectionId } from '../../hooks/useCarPage'

useGLTF.preload('/models/jaguar.glb')

const WHEEL_SPEED = 18


interface JaguarCarProps {
  progressRef: React.MutableRefObject<number>
}

export const JaguarCar = forwardRef<Group, JaguarCarProps>(
  function JaguarCar({ progressRef }, ref) {
    const { scene } = useGLTF('/models/jaguar.glb')

    const glassMat = useMemo(() => createGlassMaterial(), [])

    const { scale, yOffset } = useMemo(() => fitSceneToSize(scene, 5.5), [scene])

    // ── Materials ─────────────────────────────────────────────────────────────
    useEffect(() => {
      scene.traverse((c) => {
        if (!(c instanceof Mesh)) return
        c.castShadow = true; c.receiveShadow = false
        const name = (Array.isArray(c.material) ? c.material[0]?.name : c.material?.name)?.toLowerCase() ?? ''
        if (name.includes('glass') || name.includes('window') || name.includes('windshield')) {
          c.material = glassMat; return
        }
        const mats = Array.isArray(c.material) ? c.material : [c.material]
        for (const m of mats) {
          if (!(m instanceof MeshStandardMaterial)) continue
          m.side = DoubleSide; m.envMapIntensity = 2.0
          if (name.includes('chrome') || name.includes('trim'))  { m.metalness = 0.96; m.roughness = 0.04; m.envMapIntensity = 3.2 }
          else if (name.includes('tire') || name.includes('rubber')) { m.metalness = 0; m.roughness = 0.92; m.envMapIntensity = 0.1 }
          else if (name.includes('light'))  { m.roughness = 0.05; m.emissiveIntensity = 0.5 }
          else if (name.includes('interior') || name.includes('leather')) { m.metalness = 0.05; m.roughness = 0.80 }
          else { m.metalness = 0.75; m.roughness = 0.25; m.envMapIntensity = 2.2 }
          m.needsUpdate = true
        }
      })
    }, [scene, glassMat])

    // ── Wheel spin ────────────────────────────────────────────────────────────
    const wheels   = useRef<Object3D[]>([])
    const wheelRot = useRef(0)
    const prevProg = useRef(0)

    useEffect(() => {
      const found: Object3D[] = []
      scene.traverse((c) => {
        if (c.name.includes('WHEEL') && !c.name.includes('STEERING') && c.name.includes('mm_ext')) {
          found.push(c)
        }
      })
      wheels.current = found
    }, [scene])

    // ── Active section tracking for hotspot visibility ─────────────────────
    const [activeSection, setActiveSection] = useState('heritage')
    const prevSection = useRef('heritage')

    useFrame((_, delta) => {
      const next = getActiveSectionId(JAGUAR_SECTIONS, progressRef.current)
      if (next !== prevSection.current) {
        prevSection.current = next
        setActiveSection(next)
      }

      const p = progressRef.current
      const scrollSpeed = (p - prevProg.current) / Math.max(delta, 0.001)
      prevProg.current  = p
      wheelRot.current += scrollSpeed * WHEEL_SPEED
      for (const w of wheels.current) w.rotation.z = wheelRot.current
    })

    return (
      <group position={[-0.3, 0, 0]}>
        <group ref={ref}>
          <primitive object={scene} scale={scale} position-y={yOffset} />

          {JAGUAR_HOTSPOTS.map(hotspot => (
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
