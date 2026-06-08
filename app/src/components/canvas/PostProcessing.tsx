import { EffectComposer, Vignette, Noise, HueSaturation } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

// On a dark showroom background, we want the silver/chrome to stay vivid.
// Desaturation is kept very low — just enough to unify the scene.
// Vignette is slightly deeper to pull focus to the car.

export function PostProcessing() {
  return (
    <EffectComposer>
      {/* Minimal desaturation — let the chrome and body colour breathe */}
      <HueSaturation
        hue={0}
        saturation={-0.08}
        blendFunction={BlendFunction.NORMAL}
      />
      {/* Film grain — OVERLAY works well on dark backgrounds */}
      <Noise
        premultiply
        blendFunction={BlendFunction.OVERLAY}
        opacity={0.12}
      />
      {/* Vignette — draws the eye inward, deepens the showroom feel */}
      <Vignette
        offset={0.18}
        darkness={0.42}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
