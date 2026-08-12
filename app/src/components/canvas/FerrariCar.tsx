import { useEffect, useMemo, useRef, useState, forwardRef } from 'react'
import { useGLTF } from '../../lib/gltf'
import { useFrame } from '@react-three/fiber'
import { Box3, DoubleSide, Group, Mesh, MeshStandardMaterial, Object3D, Vector3 } from 'three'
import { createGlassMaterial, fitSceneToSize } from '../../lib/materialUtils'
import { FERRARI_HOTSPOTS } from '../../constants/hotspots'
import { CarHotspot } from './CarHotspot'
import { FERRARI_SECTIONS } from '../../constants/ferrariSections'
import { getActiveSectionId } from '../../hooks/useCarPage'

useGLTF.preload('/models/ferrari.glb')


// ─── Animation timing (scroll progress 0–1) ───────────────────────────────────
// Design (0.17–0.36):  doors swing open, windows roll down
// Engine (0.36–0.54):  hood lifts to reveal the engine bay
// Legacy (0.72–0.87):  trunk lid pops open
// Continuous:          wheels spin proportional to scroll speed

const T = {
  DOOR_OPEN:    [0.19, 0.27] as [number, number],
  DOOR_CLOSE:   [0.30, 0.36] as [number, number],
  HOOD_OPEN:    [0.38, 0.47] as [number, number],
  HOOD_CLOSE:   [0.50, 0.54] as [number, number],
  TRUNK_OPEN:   [0.74, 0.81] as [number, number],
  TRUNK_CLOSE:  [0.83, 0.87] as [number, number],
}

const DOOR_ANGLE   = 1.05   // ~60°
const HOOD_ANGLE   = 0.95   // ~54° — 250 GTO clamshell; reduce further if clipping
const TRUNK_ANGLE  = 0.85   // ~49° — tail-end decklid
const WHEEL_SPEED  = 18     // rotations per unit of scroll progress

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Collect all Object3D whose names start with a given prefix. */
function collect(root: Object3D, prefix: string): Object3D[] {
  const out: Object3D[] = []
  root.traverse((c) => { if (c.name.startsWith(prefix)) out.push(c) })
  return out
}

/**
 * Build a pivot group positioned at the hinge of a set of parts.
 * hingeEdge: which bbox edge to use for each axis — 'min' or 'max'.
 * Returns the pivot group (already attached to the parts' parent).
 */
function buildPivot(
  parts: Object3D[],
  hingeEdge: { x: 'min' | 'max' | 'center'; y: 'min' | 'max' | 'center'; z: 'min' | 'max' | 'center' },
): Group | null {
  if (!parts.length) return null
  const parent = parts[0].parent
  if (!parent) return null

  const box = new Box3()
  parts.forEach((p) => box.expandByObject(p))
  const center = box.getCenter(new Vector3())

  const pick = (axis: 'x' | 'y' | 'z', edge: 'min' | 'max' | 'center') =>
    edge === 'center' ? center[axis] : box[edge][axis]

  const pivot = new Group()
  pivot.position.set(pick('x', hingeEdge.x), pick('y', hingeEdge.y), pick('z', hingeEdge.z))
  parent.add(pivot)
  parts.forEach((p) => pivot.attach(p))
  return pivot
}

/** Ease a value in [0,1] → smooth step */
function smoothstep(x: number): number {
  return x * x * (3 - 2 * x)
}

/** Compute normalised [0,1] animation progress within a range */
function rangeProgress(p: number, start: number, end: number): number {
  if (p <= start) return 0
  if (p >= end)   return 1
  return smoothstep((p - start) / (end - start))
}

/** One-sided open/close ramp: opens [os,op], holds, closes [cs,ce] */
function openClose(p: number, os: number, op: number, cs: number, ce: number): number {
  if (p < os) return 0
  if (p <= op) return rangeProgress(p, os, op)
  if (p <= cs) return 1
  if (p <= ce) return 1 - rangeProgress(p, cs, ce)
  return 0
}

interface FerrariCarProps {
  progressRef: React.MutableRefObject<number>
}

export const FerrariCar = forwardRef<Group, FerrariCarProps>(
  function FerrariCar({ progressRef }, ref) {
    const { scene } = useGLTF('/models/ferrari.glb')

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
          else { m.metalness = 0.78; m.roughness = 0.22; m.envMapIntensity = 2.4 }
          m.needsUpdate = true
        }
      })
    }, [scene, glassMat])

    // ── Animation state ───────────────────────────────────────────────────────
    // All pivot refs — null until scene is traversed on first frame
    const doorFL   = useRef<Object3D | null>(null)
    const doorFR   = useRef<Object3D | null>(null)
    const winFL    = useRef<Object3D | null>(null)   // window FL
    const winFL1   = useRef<Object3D | null>(null)   // window FL vent
    const winFR    = useRef<Object3D | null>(null)
    const winFR1   = useRef<Object3D | null>(null)
    const winFR2   = useRef<Object3D | null>(null)
    const hood     = useRef<Group | null>(null)
    const trunk    = useRef<Group | null>(null)
    const wheels   = useRef<Object3D[]>([])

    // Smoothed animation values
    const sDoorL   = useRef(0)   // smooth door left
    const sDoorR   = useRef(0)   // smooth door right
    const sHood    = useRef(0)
    const sTrunk   = useRef(0)
    const wheelRot = useRef(0)
    const prevProg = useRef(0)

    // ── Active section tracking for hotspot visibility ─────────────────────
    const [activeSection, setActiveSection] = useState('heritage')
    const prevSection = useRef('heritage')

    // ── Scene setup — runs once after load ───────────────────────────────────
    useEffect(() => {
      scene.updateWorldMatrix(true, true)

      // ── Doors — attach SK_Door_FL/FR body parts to the model's Ani pivot nodes
      const aniFL = scene.getObjectByName('GTO:Ani_Door_FL')
      const aniFR = scene.getObjectByName('GTO:Ani_Door_FR')
      if (aniFL && aniFR) {
        collect(scene, 'GTO:SK_Door_FL').forEach((p) => aniFL.attach(p))
        collect(scene, 'GTO:SK_Door_FR').forEach((p) => aniFR.attach(p))
        doorFL.current = aniFL
        doorFR.current = aniFR
      }

      // ── Carwindow frames — find the Ani_Carwindow_* pivot nodes
      winFL.current  = scene.getObjectByName('GTO:Ani_Carwindow_FL')  ?? null
      winFL1.current = scene.getObjectByName('GTO:Ani_Carwindow_FL1') ?? null
      winFR.current  = scene.getObjectByName('GTO:Ani_Carwindow_FR')  ?? null
      winFR1.current = scene.getObjectByName('GTO:Ani_Carwindow_FR1') ?? null
      winFR2.current = scene.getObjectByName('GTO:Ani_Carwindow_FR2') ?? null

      // ── Hood — collect SK_Hood parts + front lights (they ride on the bonnet nose)
      const hoodParts = collect(scene, 'GTO:SK_Hood')
      hood.current = buildPivot(hoodParts, { x: 'center', y: 'min', z: 'max' })

      // Attach front lights so they lift with the hood
      if (hood.current) {
        collect(scene, 'GTO:SM_Light_F').forEach((n) => hood.current!.attach(n))
      }

      // ── Trunk — collect SK_Trunk parts, pivot at the front edge (Z min = toward passenger cell)
      const trunkParts = collect(scene, 'GTO:SK_Trunk')
      trunk.current = buildPivot(trunkParts, { x: 'center', y: 'min', z: 'min' })

      // ── Wheels — the 4 Ani_Disc_Scale nodes spin as one unit
      const wheelNames = [
        'GTO:Ani_Disc_Scale_FL4', 'GTO:Ani_Disc_Scale_FR4',
        'GTO:Ani_Disc_Scale_BL4', 'GTO:Ani_Disc_Scale_BR4',
      ]
      wheels.current = wheelNames
        .map((n) => scene.getObjectByName(n))
        .filter((n): n is Object3D => !!n)

    }, [scene])

    // ── Animation loop ────────────────────────────────────────────────────────
    useFrame((_, delta) => {
      const next = getActiveSectionId(FERRARI_SECTIONS, progressRef.current)
      if (next !== prevSection.current) {
        prevSection.current = next
        setActiveSection(next)
      }

      const p  = progressRef.current
      const lf = 1 - Math.pow(0.04, delta)   // cinematic lag factor

      // ── Doors
      const doorTarget = openClose(p, T.DOOR_OPEN[0], T.DOOR_OPEN[1], T.DOOR_CLOSE[0], T.DOOR_CLOSE[1])
      sDoorL.current += ( doorTarget * DOOR_ANGLE - sDoorL.current) * lf
      sDoorR.current += (-doorTarget * DOOR_ANGLE - sDoorR.current) * lf
      if (doorFL.current) doorFL.current.rotation.y = sDoorL.current
      if (doorFR.current) doorFR.current.rotation.y = sDoorR.current

      // ── Windows roll down when door opens (translate -Y into door pocket)
      const winDrop = doorTarget * -0.18   // drops 0.18 units into door
      if (winFL.current)  winFL.current.position.y  = winDrop
      if (winFL1.current) winFL1.current.position.y = winDrop * 0.7
      if (winFR.current)  winFR.current.position.y  = winDrop
      if (winFR1.current) winFR1.current.position.y = winDrop * 0.7
      if (winFR2.current) winFR2.current.position.y = winDrop * 0.5

      // ── Hood opens during engine section — positive X = nose lifts UP
      const hoodLf = 1 - Math.pow(0.018, delta)
      const hoodTarget = openClose(p, T.HOOD_OPEN[0], T.HOOD_OPEN[1], T.HOOD_CLOSE[0], T.HOOD_CLOSE[1])
      sHood.current += (hoodTarget * HOOD_ANGLE - sHood.current) * hoodLf
      if (hood.current) hood.current.rotation.x = sHood.current

      // ── Trunk pops during legacy section
      const trunkTarget = openClose(p, T.TRUNK_OPEN[0], T.TRUNK_OPEN[1], T.TRUNK_CLOSE[0], T.TRUNK_CLOSE[1])
      sTrunk.current += (trunkTarget * -TRUNK_ANGLE - sTrunk.current) * lf
      if (trunk.current) trunk.current.rotation.x = sTrunk.current

      // ── Wheels spin proportional to scroll speed (spins faster when scrolling faster)
      const scrollSpeed = (p - prevProg.current) / Math.max(delta, 0.001)
      prevProg.current  = p
      wheelRot.current += scrollSpeed * WHEEL_SPEED
      for (const w of wheels.current) w.rotation.z = wheelRot.current
    })

    return (
      <group position={[-0.3, 0, 0]}>
        <group ref={ref}>
          <primitive object={scene} scale={scale} position-y={yOffset} />

          {FERRARI_HOTSPOTS.map(hotspot => (
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
