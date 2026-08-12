import { useGLTF } from '@react-three/drei'

// Point useGLTF at our self-hosted Draco decoder so compressed GLBs load correctly.
// Every model in public/models/ declares KHR_draco_mesh_compression as *required*,
// so this must run before the first useGLTF / useGLTF.preload call.
//
// This lives here rather than in main.tsx so the entry chunk never statically
// imports @react-three/drei — that would drag the whole `three` chunk onto the
// homepage. Canvas components import useGLTF from this module instead of drei
// directly, which guarantees the decoder path is set on first evaluation.
useGLTF.setDecoderPath('/draco/')

export { useGLTF }
