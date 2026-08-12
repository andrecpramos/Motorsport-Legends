import { useEffect, useMemo, useRef, useState, forwardRef } from 'react'
import { useGLTF } from '../../lib/gltf'
import { useFrame } from '@react-three/fiber'
import { DoubleSide, Group, Mesh, MeshStandardMaterial, Object3D } from 'three'
import { createGlassMaterial, fitSceneToSize } from '../../lib/materialUtils'
import { PORSCHE_911_HOTSPOTS } from '../../constants/hotspots'
import { CarHotspot } from './CarHotspot'
import { PORSCHE_911_SECTIONS } from '../../constants/porsche911Sections'
import { getActiveSectionId } from '../../hooks/useCarPage'

useGLTF.preload('/models/porsche911.glb')


interface Porsche911CarProps {
  progressRef: React.MutableRefObject<number>
}

export const Porsche911Car = forwardRef<Group, Porsche911CarProps>(
  function Porsche911Car({ progressRef }, ref) {
    const { scene } = useGLTF('/models/porsche911.glb')

    const glassMat = useMemo(() => createGlassMaterial({ opacity: 0.28 }), [])

    const { scale, yOffset } = useMemo(() => fitSceneToSize(scene, 5.5), [scene])

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
          if (name.includes('chrome') || name.includes('trim') || name.includes('bumper')) {
            m.metalness = 0.96; m.roughness = 0.04; m.envMapIntensity = 3.2
          } else if (name.includes('tire') || name.includes('rubber') || name.includes('tyre')) {
            m.metalness = 0; m.roughness = 0.92; m.envMapIntensity = 0.1
          } else if (name.includes('light') || name.includes('lamp') || name.includes('lens')) {
            m.roughness = 0.05; m.emissiveIntensity = 0.4
          } else if (name.includes('interior') || name.includes('leather') || name.includes('seat')) {
            m.metalness = 0.05; m.roughness = 0.82
          } else {
            // Body — classic Porsche silver/platinum
            m.metalness = 0.80; m.roughness = 0.24; m.envMapIntensity = 2.2
          }
          m.needsUpdate = true
        }
      })
    }, [scene, glassMat])

    const wheels   = useRef<Object3D[]>([])
    const wheelRot = useRef(0)

    const [activeSection, setActiveSection] = useState('heritage')
    const prevSection = useRef('heritage')

    useEffect(() => {
      const found: Object3D[] = []
      scene.traverse((c) => {
        const n = c.name.toLowerCase()
        if (n.includes('wheel') || n.includes('tyre') || n.includes('tire') || n.includes('rim') || n.includes('disc')) {
          found.push(c)
        }
      })
      wheels.current = found
    }, [scene])

    useFrame((_, delta) => {
      const next = getActiveSectionId(PORSCHE_911_SECTIONS, progressRef.current)
      if (next !== prevSection.current) {
        prevSection.current = next
        setActiveSection(next)
      }

      // Smooth time-based rotation — no scroll-delta jitter
      wheelRot.current += delta * 0.8
      for (const w of wheels.current) w.rotation.z = wheelRot.current
    })

    return (
      <group position={[0, 0, 0]}>
        <group ref={ref}>
          <primitive object={scene} scale={scale} position-y={yOffset} />

          {PORSCHE_911_HOTSPOTS.map(hotspot => (
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
