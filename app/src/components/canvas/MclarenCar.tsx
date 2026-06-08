import { useEffect, useMemo, useRef, useState, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { DoubleSide, Group, Mesh, MeshStandardMaterial, Object3D } from 'three'
import { createGlassMaterial, fitSceneToSize } from '../../lib/materialUtils'
import { MCLAREN_HOTSPOTS } from '../../constants/hotspots'
import { CarHotspot } from './CarHotspot'
import { MCLAREN_SECTIONS } from '../../constants/mclarenSections'
import { getActiveSectionId } from '../../hooks/useCarPage'

useGLTF.preload('/models/mclaren.glb')

const WHEEL_SPEED = 18


interface MclarenCarProps {
  progressRef: React.MutableRefObject<number>
}

export const MclarenCar = forwardRef<Group, MclarenCarProps>(
  function MclarenCar({ progressRef }, ref) {
    const { scene } = useGLTF('/models/mclaren.glb')

    const glassMat = useMemo(() => createGlassMaterial(), [])

    const { scale, yOffset } = useMemo(() => fitSceneToSize(scene, 8.0), [scene])

    useEffect(() => {
      scene.traverse((c) => {
        if (!(c instanceof Mesh)) return
        c.castShadow = true; c.receiveShadow = false
        const name = (Array.isArray(c.material) ? c.material[0]?.name : c.material?.name)?.toLowerCase() ?? ''
        if (name.includes('glass') || name.includes('window') || name.includes('windshield') || name.includes('screen')) {
          c.material = glassMat; return
        }
        const mats = Array.isArray(c.material) ? c.material : [c.material]
        for (const m of mats) {
          if (!(m instanceof MeshStandardMaterial)) continue
          m.side = DoubleSide; m.envMapIntensity = 2.0
          if (name.includes('chrome') || name.includes('trim') || name.includes('metal')) {
            m.metalness = 0.96; m.roughness = 0.04; m.envMapIntensity = 3.2
          } else if (name.includes('tire') || name.includes('rubber') || name.includes('tyre')) {
            m.metalness = 0; m.roughness = 0.92; m.envMapIntensity = 0.1
          } else if (name.includes('light') || name.includes('lamp')) {
            m.roughness = 0.05; m.emissiveIntensity = 0.5
          } else if (name.includes('interior') || name.includes('leather') || name.includes('seat')) {
            m.metalness = 0.05; m.roughness = 0.80
          } else {
            // Body — deep orange-black with metallic sheen
            m.metalness = 0.82; m.roughness = 0.18; m.envMapIntensity = 2.6
          }
          m.needsUpdate = true
        }
      })
    }, [scene, glassMat])

    const wheels   = useRef<Object3D[]>([])
    const wheelRot = useRef(0)
    const prevProg = useRef(0)

    const [activeSection, setActiveSection] = useState('heritage')
    const prevSection = useRef('heritage')

    useEffect(() => {
      const found: Object3D[] = []
      scene.traverse((c) => {
        const n = c.name.toLowerCase()
        if (n.includes('wheel') || n.includes('tyre') || n.includes('tire') || n.includes('rim')) {
          found.push(c)
        }
      })
      wheels.current = found
    }, [scene])

    useFrame((_, delta) => {
      const next = getActiveSectionId(MCLAREN_SECTIONS, progressRef.current)
      if (next !== prevSection.current) {
        prevSection.current = next
        setActiveSection(next)
      }

      const p = progressRef.current
      const scrollSpeed = (p - prevProg.current) / Math.max(delta, 0.001)
      prevProg.current = p
      wheelRot.current += scrollSpeed * WHEEL_SPEED
      for (const w of wheels.current) w.rotation.z = wheelRot.current
    })

    return (
      <group position={[-0.3, 0, 0]}>
        <group ref={ref}>
          <primitive object={scene} scale={scale} position-y={yOffset} />

          {MCLAREN_HOTSPOTS.map(hotspot => (
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
