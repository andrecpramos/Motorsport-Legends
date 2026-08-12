import { useEffect, useState } from 'react'
import { PageMeta } from '../components/ui/PageMeta'
import { TimelineSection } from '../components/sections/TimelineSection'
import { AuthModal } from '../components/ui/AuthModal'
import { useAuth } from '../contexts/AuthContext'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// ─── Video background ─────────────────────────────────────────────────────────
// Source files live in public/videos/ — hero.webm (VP9, ~1.1 MB) is offered first,
// hero.mp4 (H.264, ~2.0 MB) is the fallback, and hero-poster.jpg paints the first
// frame instantly. Keep these encoded for the web: the video autoplays on the
// landing route, so an oversized master file blocks the homepage for everyone.
// Re-encode with:
//   ffmpeg -i master.mp4 -vf scale=1600:-2 -c:v libx264 -crf 28 -preset slow \
//          -pix_fmt yuv420p -movflags +faststart -an hero.mp4
//   ffmpeg -i master.mp4 -vf scale=1440:-2 -c:v libvpx-vp9 -crf 44 -b:v 0 -an hero.webm

function VideoBackground() {
  return (
    <>
      {/* Video layer */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/hero-poster.jpg"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          opacity: 0.50,
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        {/* WebM first — ~80% smaller than MP4 on supporting browsers */}
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4"  type="video/mp4"  />
      </video>

      {/* Dark overlay — tint only, not blackout */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'rgba(8,7,5,0.42)',
          pointerEvents: 'none',
        }}
      />

      {/* Edge vignette — darken only the perimeter, keep center lighter */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: [
            'linear-gradient(to bottom, rgba(8,7,5,0.55) 0%, transparent 18%, transparent 72%, rgba(8,7,5,0.65) 100%)',
          ].join(', '),
          pointerEvents: 'none',
        }}
      />
    </>
  )
}

// ─── Parallax ambient layer ───────────────────────────────────────────────────

function ParallaxLayer() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 30, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 30, damping: 30 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth  - 0.5) * 25)
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 18)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY])

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: springX, y: springY,
        position: 'absolute', top: '-5%', left: '-5%',
        width: '110%', height: '110%',
        zIndex: 3,
        background: 'radial-gradient(ellipse 50% 40% at 50% 52%, rgba(176,148,90,0.055) 0%, transparent 60%)',
        pointerEvents: 'none',
      }}
    />
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────

function HomeHeader({ onAccount }: { onAccount: () => void }) {
  const { user } = useAuth()
  const initial = user?.email?.[0]?.toUpperCase() ?? null

  return (
    <div
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-10 md:px-16 py-5"
      style={{ pointerEvents: 'none' }}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        style={{ pointerEvents: 'auto' }}
      >
        <p className="font-display font-light italic text-lg text-ink/90 tracking-wider leading-none">
          Legends
        </p>
        <p className="font-body text-[8px] tracking-[0.45em] text-accent/75 uppercase mt-0.5">
          Classic Automobiles
        </p>
      </motion.div>

      {/* Account button */}
      <motion.button
        onClick={onAccount}
        aria-label={user ? 'Your account' : 'Sign in or create account'}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        style={{ pointerEvents: 'auto' }}
        className="flex items-center gap-2.5 group"
      >
        {initial ? (
          // Logged-in avatar
          <span
            className="flex items-center justify-center font-body text-[10px] tracking-wider text-background uppercase transition-colors duration-300"
            style={{
              width: 28, height: 28,
              background: 'rgb(var(--color-accent) / 0.85)',
              borderRadius: '50%',
            }}
          >
            {initial}
          </span>
        ) : (
          // Sign in link
          <span className="font-body text-[10px] tracking-[0.3em] text-ink/70 uppercase italic group-hover:text-accent transition-colors duration-300">
            Account
          </span>
        )}
      </motion.button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false)
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
    <PageMeta
      title="Legends — Classic Automobiles"
      description="Immersive 3D showcases of the most iconic machines ever built — Mercedes-Benz 300 SL Gullwing, Ferrari 250 GTO, Jaguar E-Type. By appointment only."
    />
    <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    <div
      className="bg-background text-ink"
      style={{ height: '100svh', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      {/* ── Background ── */}
      <div className="absolute inset-0" aria-hidden="true">
        <VideoBackground />
        <ParallaxLayer />
      </div>

      {/* ── Header ── */}
      <div className="relative flex-shrink-0">
        <HomeHeader onAccount={() => setAuthOpen(true)} />
      </div>

      {/* ── Timeline — fills all remaining height ── */}
      <div className="relative flex-1 min-h-0">
        <TimelineSection />
      </div>

      {/* ── Bottom label ── */}
      <div
        className="relative flex-shrink-0 flex items-center justify-between px-10 md:px-14 py-2 border-t border-ink/[0.05] z-10"
        aria-hidden="true"
      >
        <p className="font-body text-[8px] tracking-[0.4em] text-ink/40 uppercase italic">
          Museum-grade Presentation
        </p>
        <p className="font-body text-[8px] tracking-[0.4em] text-ink/30 uppercase hidden md:block">
          Three Machines · Three Eras
        </p>
      </div>
    </div>
    </>
  )
}
