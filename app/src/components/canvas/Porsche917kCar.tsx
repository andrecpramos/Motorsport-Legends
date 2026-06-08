import { useEffect, useMemo, useRef, useState, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { DoubleSide, Group, Mesh, MeshStandardMaterial, Object3D } from 'three'
import { createGlassMaterial, fitSceneToSize } from '../../lib/materialUtils'
import { PORSCHE_917K_HOTSPOTS } from '../../constants/hotspots'
import { CarHotspot } from './CarHotspot'
import { PORSCHE_917K_SECTIONS } from '../../constants/porsche917kSections'
import { getActiveSectionId } from '../../hooks/useCarPage'

useGLTF.preload('/models/porsche917k.glb')


interface Porsche917kCarProps {
  progressRef: React.MutableRefObject<number>
}

export const Porsche917kCar = forwardRef<Group, Porsche917kCarProps>(
  function Porsche917kCar({ progressRef }, ref) {
    const { scene } = useGLTF('/models/porsche917k.glb')

    const glassMat = useMemo(() => createGlassMaterial({
      color: 0xaaccdd, roughness: 0.02, transmission: 0.88,
      thickness: 0.2, opacity: 0.25, envMapIntensity: 2.2,
    }), [])

    const { scale, yOffset } = useMemo(
      // Racing cars are very low and wide — fit to 5.5 unit longest axis, 2 mm floor gap
      () => fitSceneToSize(scene, 5.5, 0.02),
      [scene],
    )

    useEffect(() => {
      scene.traverse((c) => {
        if (!(c instanceof Mesh)) return
        c.castShadow = true; c.receiveShadow = false
        const name = (Array.isArray(c.material) ? c.material[0]?.name : c.material?.name)?.toLowerCase() ?? ''
        if (name.includes('glass') || name.includes('window') || name.includes('visor') || name.includes('screen')) {
          c.material = glassMat; return
        }
        const mats = Array.isArray(c.material) ? c.material : [c.material]
        for (const m of mats) {
          if (!(m instanceof MeshStandardMaterial)) continue
          m.side = DoubleSide; m.envMapIntensity = 2.4
          if (name.includes('chrome') || name.includes('exhaust') || name.includes('pipe')) {
            m.metalness = 0.97; m.roughness = 0.03; m.envMapIntensity = 3.5
          } else if (name.includes('tire') || name.includes('rubber') || name.includes('tyre')) {
            m.metalness = 0; m.roughness = 0.95; m.envMapIntensity = 0.05
          } else if (name.includes('light') || name.includes('lamp')) {
            m.roughness = 0.04; m.emissiveIntensity = 0.6
          } else if (name.includes('cockpit') || name.includes('seat') || name.includes('interior')) {
            m.metalness = 0.10; m.roughness = 0.75
          } else {
            // Body — red livery base, high metalness for racing sheen
            m.metalness = 0.72; m.roughness = 0.28; m.envMapIntensity = 2.6
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
      const next = getActiveSectionId(PORSCHE_917K_SECTIONS, progressRef.current)
      if (next !== prevSection.current) {
        prevSection.current = next
        setActiveSection(next)
      }

      // Freeze wheel rotation when a modal is open
      if (document.body.style.overflow === 'hidden') return

      // Smooth time-based rotation — no scroll-delta jitter
      wheelRot.current += delta * 1.2
      for (const w of wheels.current) w.rotation.z = wheelRot.current
    })

    return (
      <group position={[0, 0, 0]}>
        <group ref={ref}>
          <primitive object={scene} scale={scale} position-y={yOffset} />

          {PORSCHE_917K_HOTSPOTS.map(hotspot => (
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
