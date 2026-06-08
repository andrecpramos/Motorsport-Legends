import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment as DreiEnvironment, MeshReflectorMaterial } from '@react-three/drei'
import { BufferAttribute, Color, PointLight, Points, PointsMaterial, ShaderMaterial } from 'three'

// ─── Shared orbit light — slow-sweeping highlight across bodywork ─────────────

interface OrbitLightProps {
  color?:     string
  intensity?: number
  distance?:  number
  speed?:     number
  height?:    number
  radius?:    number
}

export function OrbitLight({
  color     = '#ffe0a0',
  intensity = 5.0,
  distance  = 28,
  speed     = 0.12,
  height    = 3.5,
  radius    = 9,
}: OrbitLightProps = {}) {
  const lightRef = useRef<PointLight>(null)
  useFrame(({ clock }) => {
    if (!lightRef.current) return
    const t = clock.getElapsedTime() * speed
    lightRef.current.position.set(Math.cos(t) * radius, height, Math.sin(t) * radius)
  })
  return <pointLight ref={lightRef} color={color} intensity={intensity} distance={distance} />
}

// Dark elliptical contact shadow — subtle grounding under the car
const CONTACT_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const CONTACT_FRAG = `
  uniform vec3  uColor;
  uniform float uTime;
  varying vec2  vUv;
  void main() {
    vec2  c    = vUv - 0.5;
    float d    = length(c * vec2(0.95, 2.1));
    float soft = 1.0 - smoothstep(0.0, 0.48, d);
    float pulse = 0.97 + 0.03 * sin(uTime * 0.7);
    gl_FragColor = vec4(uColor, soft * 0.55 * pulse);
  }
`


export function SceneEnvironment({ fogColor = '#080705' }: { fogColor?: string }) {
  const particlesRef = useRef<Points>(null)

  // Contact shadow material
  const contactMat = useMemo(() => new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new Color(0x000000) },
      uTime:  { value: 0 },
    },
    vertexShader:   CONTACT_VERT,
    fragmentShader: CONTACT_FRAG,
  }), [])

  // Warm dust motes — visible against the dark background
  const { positions, phases } = useMemo(() => {
    const count = 280
    const pos    = new Float32Array(count * 3)
    const ph     = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 36
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16
      pos[i * 3 + 2] = (Math.random() - 0.5) * 26
      ph[i]          = Math.random() * Math.PI * 2
    }
    return { positions: pos, phases: ph }
  }, [])

  const particleMat = useMemo(
    () => new PointsMaterial({
      color: 0xffe8a0,
      size: 0.022,
      transparent: true,
      opacity: 0.30,
      sizeAttenuation: true,
    }),
    []
  )

  const posRef = useRef(positions.slice())

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    contactMat.uniforms.uTime.value = t

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.007

      const buf = particlesRef.current.geometry.attributes.position as BufferAttribute
      for (let i = 0; i < phases.length; i++) {
        const baseY = positions[i * 3 + 1]
        buf.setY(i, baseY + Math.sin(t * 0.18 + phases[i]) * 0.6)
      }
      buf.needsUpdate = true
    }
  })

  return (
    <>
      {/* Warehouse preset — dark industrial environment, great for metallic reflections */}
      <DreiEnvironment preset="warehouse" />
      <fog attach="fog" args={[fogColor, 18, 45]} />

      {/* Dark gloss showroom floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          blur={[500, 150]}
          resolution={1024}
          mixBlur={0.6}
          mixStrength={5.0}
          roughness={0.1}
          depthScale={1.2}
          minDepthThreshold={0.2}
          maxDepthThreshold={1.4}
          color="#060504"
          metalness={0.5}
          mirror={0}
        />
      </mesh>

      {/* Contact shadow — deep under-car darkness */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} renderOrder={1}>
        <planeGeometry args={[9, 6]} />
        <primitive object={contactMat} attach="material" />
      </mesh>

      {/* Warm dust motes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[posRef.current, 3]} />
        </bufferGeometry>
        <primitive object={particleMat} attach="material" />
      </points>
    </>
  )
}
