# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

All application code lives under `app/`. Run every command from that directory.

```
app/
  api/          Vercel serverless functions (enquire.ts, leads.ts, admin-auth.ts)
  public/
    draco/      Self-hosted Draco decoder for compressed GLB loading
    models/     GLB car models (ferrari.glb, gullwing.glb, jaguar.glb, mclaren.glb, …)
    videos/     hero.webm / hero.mp4 background video
  src/
    components/
      canvas/   R3F scene components (CarCanvas, <Car>Scene, <Car>Car, Environment, PostProcessing)
      layout/   Navbar, CarNavbar
      sections/ Section overlay components (GenericSection, StarSection, …)
      ui/       Utility UI (EnquiryModal, AuthModal, PageMeta, ErrorBoundary, …)
    constants/  Per-car section definitions (<car>Sections.ts) + theme.ts + hotspots.ts + rivalries.ts
    contexts/   AuthContext (Supabase auth, nullable)
    hooks/      useScrollProgress, useCarPage, use<Car>Animation, useIsMobile
    lib/        animationUtils.ts, gsap.ts, supabase.ts, materialUtils.ts
    pages/      One page component per route
    types/      Section, Stat, CarTransform, Keyframe interfaces
```

## Commands

All commands must be run from `app/`:

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build
npm run lint      # ESLint (src + api), --max-warnings 0
npm run preview   # Preview the dist build
```

No test runner is configured.

## Core architecture

### Scroll-driven 3D presentation

Each car page is a fullscreen sticky scroll experience:

1. `#scroll-container` is a tall div (e.g. `2000vh`). The sticky child holds the 3D canvas + overlay text at `height: 100svh`.
2. `useScrollProgress()` creates a GSAP `ScrollTrigger` on `#scroll-container` and writes `self.progress` (0–1) into a `progressRef` (`MutableRefObject<number>`). This ref is passed by reference into the R3F canvas — no re-renders on scroll.
3. Inside the R3F canvas, `use<Car>Animation()` hooks run in `useFrame` and read `progressRef.current` every frame, interpolating between typed `Keyframe[]` arrays to drive camera position and car rotation via `interpolateKeyframes()` in `src/lib/animationUtils.ts`.
4. `useActiveSection()` runs a `requestAnimationFrame` loop outside the canvas, polling `progressRef.current` against each section's `progressStart`/`progressEnd` range to determine which section is active. Section overlays are rendered in a `z-10` absolute div layered over the canvas.

### Adding a new car

Follow the existing pattern:
- `src/constants/<car>Sections.ts` — define `Section[]` with `progressStart`/`progressEnd` fractions and export a `TOTAL_SCROLL_HEIGHT` string (e.g. `'2000vh'`)
- `src/hooks/use<Car>Animation.ts` — define `KEYFRAMES: Keyframe[]` and `LOOKAT_Y: number[]`, use `interpolateKeyframes` + `useFrame` (copy `useFerrariAnimation.ts`)
- `src/components/canvas/<Car>Car.tsx` — load the GLB via `useGLTF`, apply `materialUtils`, wrap in `forwardRef<Group>`
- `src/components/canvas/<Car>Scene.tsx` — compose `CarCanvas` + `SceneContent` + `SceneLoadingOverlay`
- `src/pages/<Car>Page.tsx` — wire up `useScrollProgress`, `useActiveSection`, `CarNavbar`, `GenericSection`/`StarSection` overlays, mobile fallback via `useIsMobile` → `CarMobilePage`
- Register the route in `src/main.tsx` as a lazy import

### Design system

Colors are CSS custom properties stored as **space-separated RGB tuples** (not hex) so Tailwind's opacity modifiers (`bg-accent/60`) work correctly.

Global defaults in `src/index.css`:
- `--color-background`: `8 7 5` (near-black showroom)
- `--color-accent`: `176 148 90` (warm automotive gold)
- `--color-text`: `220 215 205` (warm near-white)

Each car page overrides these on its root `<div>` via an inline `style` prop to apply the car's brand palette (e.g. Ferrari sets `--color-accent: '176 28 20'`). Mobile pages pass `accentCss`/`bgCss`/`surfaceCss` string props directly to `CarMobilePage`.

Tailwind font families: `font-display` → Cormorant Garamond (headings), `font-body` → EB Garamond (body text). Path aliases: `@`, `@components`, `@hooks`, `@lib`, `@constants`, `@pages`.

### Bundle splitting

`vite.config.ts` isolates Three.js/R3F/postprocessing into a `three` chunk and GSAP into a `gsap` chunk. Car pages are lazy-loaded in `main.tsx` via `React.lazy` so the homepage never downloads these large dependencies. `useGLTF.setDecoderPath('/draco/')` is called once at startup so compressed GLBs resolve the self-hosted decoder.

### Backend (Vercel serverless)

`app/api/` contains Vercel Node.js serverless functions:
- `enquire.ts` — validates form submissions, stores leads in Supabase, sends Resend email notifications (rate-limited at 5/hour per IP)
- `leads.ts` — admin-facing lead retrieval
- `admin-auth.ts` — admin session verification

Required environment variables for the API: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_NOTIFY_EMAIL`, `SITE_URL`.

### Auth

`src/lib/supabase.ts` exports a nullable `supabase` client — it is `null` when `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are unset. All consumers guard against `null`. `AuthContext` gracefully disables itself when Supabase is unconfigured.

### Mobile

`useIsMobile()` detects viewport width < 768px. Car pages render `<CarMobilePage>` (static image layout, no 3D canvas) on mobile — the R3F canvas is never mounted on mobile.
