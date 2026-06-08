# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Premium scroll-driven 3D car website — **Mercedes-Benz 300 SL Gullwing** showcase. Retro-prestige aesthetic: sepia tones, old-film grain, Cormorant Garamond typography. 7 sections. Real GLTF car model.

## Commands

```bash
cd app
npm run dev       # dev server (localhost:5173)
npm run build     # TypeScript check + Vite production build
npm run preview   # preview production build
```

## Tech Stack

- **React 18 + Vite + TypeScript** (`verbatimModuleSyntax` — always `import type` for types)
- **React Three Fiber + @react-three/drei** — 3D canvas, `useGLTF`, `MeshReflectorMaterial`
- **@react-three/postprocessing** — `HueSaturation`, `Noise` (film grain), `Vignette`
- **GSAP ScrollTrigger** — scroll progress driver
- **Framer Motion** — section text animations
- **Tailwind CSS v3** — CSS custom property tokens

## 3D Model

`app/public/models/gullwing.glb` — Mercedes-Benz 300 SL Gullwing, converted from OBJ (Sketchfab). Materials are entirely overridden in `GullwingCar.tsx` (body: dark graphite, chrome trim). The model is auto-centered and scaled to 4.2 units via bounding box in a `useEffect`.

## Architecture

### Scroll System

Tall `div#scroll-container` (`750vh`) with a `position: sticky; height: 100vh` wrapper. GSAP ScrollTrigger writes scroll progress into `progressRef` (a plain `useRef<number>` — no state, no re-renders). R3F `useFrame` reads that ref each tick.

**Key file:** `src/hooks/useScrollProgress.ts`

### Scroll → 3D Animation

`src/hooks/useCarAnimation.ts` — keyframe table (14 entries) maps `progress` (0–1) to camera + car transforms. Smoothstep easing + `lerpFactor = 1 - 0.06^delta` for cinematic lag. `lookAtY` also interpolates per-keyframe so camera target changes with sections (interior section looks further up).

### Section System

7 sections in `src/constants/sections.ts` with `progressStart`/`progressEnd` ranges. `App.tsx` runs one consolidated rAF loop — only calls `setActiveId` when the section actually changes. `ProgressBar` and `Navbar` update the DOM directly (no React state) at 60fps.

### Film Aesthetic

- **CSS film grain**: animated SVG noise pseudo-element on `#root::after` (z-index 9999, `mix-blend-mode: overlay`)
- **Three.js post**: `HueSaturation(saturation: -0.38)` + `Noise` + `Vignette`
- **Fonts**: Cormorant Garamond (display, italic for headings) + EB Garamond (body)

### Mobile

`useIsMobile` → `<MobileFallback />` — static scroll with SVG car silhouette, no WebGL.

## Key Files

| File | Purpose |
|------|---------|
| `src/constants/sections.ts` | All 7 section content + scroll ranges |
| `src/hooks/useScrollProgress.ts` | GSAP → `progressRef` |
| `src/hooks/useCarAnimation.ts` | 14-keyframe camera/car interpolation table |
| `src/components/canvas/GullwingCar.tsx` | GLTF load, material override, wheel spin |
| `src/components/canvas/CarScene.tsx` | R3F Canvas, warm tungsten lighting setup |
| `src/components/canvas/PostProcessing.tsx` | Film desaturation + grain + vignette |
| `src/App.tsx` | Sticky scroll architecture, 7-section mount |

## Sections (in order)

| ID | Progress | Camera |
|----|----------|--------|
| `heritage` | 0–12% | Wide 3/4, overhead |
| `design` | 12–27% | Low side profile |
| `engine` | 27–43% | Front 3/4 |
| `doors` | 43–58% | Overhead, see roofline |
| `interior` | 58–73% | Close overhead cockpit |
| `legacy` | 73–88% | Wide dramatic pull-back |
| `acquire` | 88–100% | Elegant final pose |

## Design Tokens

| Token | Value |
|-------|-------|
| `--color-background` | `#080705` (warm near-black) |
| `--color-accent` | `#9e8a72` (sepia brown) |
| Font display | Cormorant Garamond, italic weight |
| Font body | EB Garamond |
