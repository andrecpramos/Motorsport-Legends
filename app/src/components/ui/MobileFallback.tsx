import { useRef, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { SectionTitle } from './SectionTitle'
import { FeatureTag } from './FeatureTag'
import { MobileCarScene } from '../canvas/MobileCarScene'
import { SECTIONS } from '../../constants/sections'
import type { Section } from '../../types'

const OWNERS = [
  { name: 'Cary Grant',         role: 'Actor'                 },
  { name: 'Clark Gable',        role: 'Actor'                 },
  { name: 'Stirling Moss',      role: 'Racing Driver'         },
  { name: 'Sophia Loren',       role: 'Actress'               },
  { name: 'Pablo Picasso',      role: 'Artist'                },
  { name: 'Tony Curtis',        role: 'Actor'                 },
  { name: 'Prince Rainier III', role: 'Sovereign of Monaco'   },
  { name: 'Juan Manuel Fangio', role: 'Formula 1 Champion'    },
]

interface MobileFallbackProps {
  onEnquire: () => void
}

// ─── Fixed header ─────────────────────────────────────────────────────────────

function MobileHeader({ onEnquire }: { onEnquire: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-background/90 backdrop-blur-xl border-b border-ink/[0.06]">
      <div>
        <p className="font-display font-light italic text-base text-ink tracking-wider leading-none">
          300 SL
        </p>
        <p className="font-body text-[8px] tracking-[0.4em] text-accent/60 uppercase mt-0.5">
          Gullwing
        </p>
      </div>
      <button
        onClick={onEnquire}
        aria-label="Open enquiry form"
        className="px-4 py-1.5 border border-accent/40 font-body text-[9px] tracking-[0.3em] text-accent/75 uppercase hover:bg-accent/10 transition-colors duration-300"
      >
        Enquire
      </button>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function MobileHero({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const scrollToNext = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="h-[100svh] relative overflow-hidden"
      aria-label="Hero"
    >
      {/* Bottom gradient — blends canvas into page scroll */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
        style={{
          height: '35%',
          background: 'linear-gradient(to top, rgb(8 7 5) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Top gradient — softens header edge */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none z-10"
        style={{
          height: '20%',
          background: 'linear-gradient(to bottom, rgb(8 7 5 / 0.6) 0%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Top-left label */}
      <motion.p
        className="absolute top-20 left-6 z-20 font-body text-[9px] tracking-[0.55em] text-accent/50 uppercase italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Mercedes-Benz
      </motion.p>

      {/* Top-right year */}
      <motion.p
        className="absolute top-20 right-6 z-20 font-body text-[9px] tracking-[0.4em] text-ink/22 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        Est. 1954
      </motion.p>

      {/* Main title — bottom-left */}
      <div className="absolute bottom-24 left-6 space-y-2 z-20">
        <div className="overflow-hidden pb-1">
          <motion.h1
            className="font-display font-light italic text-ink leading-none"
            style={{ fontSize: 'clamp(4.5rem, 22vw, 7rem)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            300 SL
          </motion.h1>
        </div>

        <div className="overflow-hidden pb-1">
          <motion.p
            className="font-display font-light text-accent tracking-[0.18em]"
            style={{ fontSize: 'clamp(1.2rem, 6vw, 2.2rem)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            GULLWING
          </motion.p>
        </div>

        <motion.div
          className="w-8 h-px bg-accent/35 mt-4"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ transformOrigin: 'left' }}
          transition={{ delay: 1.4, duration: 1.0, ease: 'easeOut' }}
        />

        <motion.p
          className="font-body text-[11px] italic text-ink/75 leading-relaxed max-w-[160px] pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          The car that changed everything.
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.button
        className="absolute bottom-10 right-6 z-20 flex flex-col items-center gap-2"
        onClick={scrollToNext}
        aria-label="Scroll to story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
      >
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-accent/45 to-transparent"
          animate={{ scaleY: [1, 0.35, 1], opacity: [0.45, 1, 0.45] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        />
        <span className="font-body text-[9px] tracking-[0.35em] text-accent/40 uppercase">
          Scroll
        </span>
      </motion.button>

      {/* Section counter */}
      <p className="absolute bottom-10 left-6 z-20 font-body text-[9px] tracking-[0.4em] text-ink/18 uppercase pointer-events-none">
        01 / {String(SECTIONS.length).padStart(2, '0')}
      </p>
    </section>
  )
}

// ─── Content section ──────────────────────────────────────────────────────────

function MobileSection({ section, index }: { section: Section; index: number }) {
  const sectionNumber = String(index + 2).padStart(2, '0')
  const total = String(SECTIONS.length).padStart(2, '0')

  const fadeUpInitial = { opacity: 0, y: 22 }
  const fadeUpAnimate = { opacity: 1, y: 0 }
  const fadeUpViewport = { once: true, margin: '-12%' as const }

  return (
    <motion.section
      aria-label={section.title}
      className="relative min-h-[88svh] flex flex-col justify-center px-6 py-20 border-t border-ink/[0.07]"
      style={{ background: 'rgb(var(--color-background) / 0.92)', backdropFilter: 'blur(1px)' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.6 }}
    >
      {/* Section number — top-right corner */}
      <p className="absolute top-6 right-6 font-body text-[9px] tracking-[0.4em] text-ink/18 uppercase">
        {sectionNumber} / {total}
      </p>

      {/* Accent line — left edge */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-px bg-accent/20"
        style={{ height: '30%' }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="pl-2">
        <SectionTitle subtitle={section.subtitle} title={section.title} />

        <motion.p
          className="font-body text-[13px] italic text-ink/80 leading-loose mt-5 max-w-[340px]"
          initial={fadeUpInitial}
          whileInView={fadeUpAnimate}
          viewport={fadeUpViewport}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {section.copy}
        </motion.p>

        {/* Stats */}
        {section.stats && (
          <motion.dl
            className="grid grid-cols-2 gap-x-6 gap-y-7 mt-9"
            initial={fadeUpInitial}
            whileInView={fadeUpAnimate}
            viewport={fadeUpViewport}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {section.stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <dd className="flex items-end gap-1.5">
                  <span className="font-display font-light italic text-ink leading-none"
                    style={{ fontSize: 'clamp(2.2rem, 11vw, 3.2rem)' }}>
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="font-body text-[10px] text-accent mb-1 tracking-wider italic">
                      {stat.unit}
                    </span>
                  )}
                </dd>
                <dt className="font-body text-[9px] tracking-[0.35em] text-ink/75 uppercase">
                  {stat.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        )}

        {/* Features */}
        {section.features && (
          <motion.ul
            className="mt-9 space-y-3"
            initial={fadeUpInitial}
            whileInView={fadeUpAnimate}
            viewport={fadeUpViewport}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {section.features.map((f, i) => (
              <li key={f}>
                <FeatureTag label={f} index={i} />
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.section>
  )
}

// ─── Acquire / CTA ────────────────────────────────────────────────────────────

function MobileAcquire({ onEnquire }: { onEnquire: () => void }) {
  const section = SECTIONS[SECTIONS.length - 1]
  const total = String(SECTIONS.length).padStart(2, '0')

  return (
    <section
      aria-label="Acquire"
      className="relative min-h-[100svh] flex flex-col justify-center items-center px-8 text-center border-t border-ink/[0.07] py-20"
      style={{ background: 'rgb(var(--color-background) / 0.95)', backdropFilter: 'blur(2px)' }}
    >
      {/* Section number */}
      <p className="absolute top-6 right-6 font-body text-[9px] tracking-[0.4em] text-ink/18 uppercase">
        {total} / {total}
      </p>

      <motion.div
        className="space-y-7 max-w-xs w-full"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8 }}
      >
        <div className="space-y-3">
          <p className="font-body text-[9px] tracking-[0.5em] text-accent/60 uppercase italic">
            {section.subtitle}
          </p>

          <h2
            className="font-display font-light italic text-ink leading-none"
            style={{ fontSize: 'clamp(3.2rem, 16vw, 5.5rem)' }}
          >
            {section.title}
          </h2>

          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="h-px bg-accent/25 w-8" />
            <div className="w-[3px] h-[3px] rounded-full bg-accent/35" />
            <div className="h-px bg-accent/15 w-4" />
          </div>
        </div>

        <p className="font-body text-[13px] italic text-ink/78 leading-loose">
          {section.copy}
        </p>

        <div className="space-y-3 pt-2">
          <button
            onClick={onEnquire}
            aria-label="Open private enquiry form"
            className="group relative w-full py-4 border border-accent/50 font-body text-[11px] tracking-[0.35em] text-accent uppercase overflow-hidden"
          >
            <span className="absolute inset-0 bg-accent origin-left scale-x-0 group-active:scale-x-100 transition-transform duration-300 ease-out" />
            <span className="relative group-active:text-background transition-colors duration-300">
              Enquire Privately
            </span>
          </button>

          <button
            onClick={onEnquire}
            aria-label="Request provenance documentation"
            className="w-full py-4 border border-ink/15 font-body text-[11px] tracking-[0.35em] text-ink/78 uppercase hover:border-accent/30 transition-colors duration-300"
          >
            View Provenance
          </button>
        </div>

        <p className="font-body text-[9px] tracking-[0.35em] text-ink/60 uppercase pt-1">
          By appointment only
        </p>
      </motion.div>
    </section>
  )
}

// ─── Stars / Register ─────────────────────────────────────────────────────────

function MobileStars() {
  const starsSection = SECTIONS.find((s) => s.id === 'stars')!
  const starsIndex = SECTIONS.findIndex((s) => s.id === 'stars')
  const sectionNumber = String(starsIndex + 1).padStart(2, '0')
  const total = String(SECTIONS.length).padStart(2, '0')

  const fadeUpInitial = { opacity: 0, y: 22 }
  const fadeUpAnimate = { opacity: 1, y: 0 }
  const fadeUpViewport = { once: true, margin: '-12%' as const }

  return (
    <motion.section
      aria-label={starsSection.title}
      className="relative min-h-[100svh] flex flex-col justify-center px-6 py-20 border-t border-ink/[0.07]"
      style={{ background: 'rgb(var(--color-background) / 0.92)', backdropFilter: 'blur(1px)' }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.6 }}
    >
      {/* Section number */}
      <p className="absolute top-6 right-6 font-body text-[9px] tracking-[0.4em] text-ink/18 uppercase">
        {sectionNumber} / {total}
      </p>

      {/* Accent line — left edge */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-px bg-accent/20"
        style={{ height: '30%' }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="pl-2">
        <motion.p
          className="font-body text-[9px] tracking-[0.5em] text-accent/60 uppercase italic mb-2"
          initial={fadeUpInitial}
          whileInView={fadeUpAnimate}
          viewport={fadeUpViewport}
          transition={{ duration: 0.5 }}
        >
          {starsSection.subtitle}
        </motion.p>

        <motion.h2
          className="font-display font-light italic text-ink leading-none mb-4"
          style={{ fontSize: 'clamp(2.8rem, 13vw, 4.5rem)' }}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={fadeUpViewport}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {starsSection.title}
        </motion.h2>

        <motion.p
          className="font-body text-[13px] italic text-ink/80 leading-loose max-w-[300px] mb-10"
          initial={fadeUpInitial}
          whileInView={fadeUpAnimate}
          viewport={fadeUpViewport}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {starsSection.copy}
        </motion.p>

        {/* 2-column owner grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-7">
          {OWNERS.map((owner, i) => (
            <motion.div
              key={owner.name}
              className="space-y-1"
              initial={fadeUpInitial}
              whileInView={fadeUpAnimate}
              viewport={fadeUpViewport}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.06 }}
            >
              <div className="w-3 h-px bg-accent/40 mb-1.5" />
              <p className="font-display font-light italic text-ink/90 text-base leading-snug">
                {owner.name}
              </p>
              <p className="font-body text-[8px] tracking-[0.3em] text-accent/55 uppercase">
                {owner.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function MobileFallback({ onEnquire }: MobileFallbackProps) {
  const firstSectionRef = useRef<HTMLElement | null>(null)
  const progressRef     = useRef(0)
  const canvasWrapRef   = useRef<HTMLDivElement>(null)

  // Drive scroll progress + canvas parallax opacity via direct DOM (no re-renders)
  useEffect(() => {
    const onScroll = () => {
      const scrollY    = window.scrollY
      const maxScroll  = Math.max(document.body.scrollHeight - window.innerHeight, 1)
      const heroHeight = window.innerHeight

      // 0→1 progress across entire page
      progressRef.current = scrollY / maxScroll

      // Canvas fades: full opacity in hero, transitions to subtle ghost in content
      if (canvasWrapRef.current) {
        let opacity: number
        if (scrollY <= heroHeight) {
          opacity = 1
        } else if (scrollY <= heroHeight + 120) {
          opacity = 1 - ((scrollY - heroHeight) / 120) * 0.88
        } else {
          opacity = 0.12
        }
        canvasWrapRef.current.style.opacity = String(opacity)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const contentSections = SECTIONS.slice(1).filter(
    (s) => s.id !== 'stars' && s.id !== 'acquire'
  )

  return (
    <div className="bg-background text-ink overflow-x-hidden">
      {/* ── Fixed canvas — only on capable devices (4+ CPU threads) ── */}
      {typeof navigator !== 'undefined' && navigator.hardwareConcurrency >= 4 && (
        <div
          ref={canvasWrapRef}
          className="fixed inset-0 z-0 pointer-events-none"
          aria-hidden="true"
        >
          <Suspense fallback={null}>
            <MobileCarScene progressRef={progressRef} />
          </Suspense>
        </div>
      )}

      <MobileHeader onEnquire={onEnquire} />

      <main className="relative z-10">
        <MobileHero sectionRef={firstSectionRef} />

        {contentSections.map((section, i) => {
          const isFirst = i === 0
          return (
            <div
              key={section.id}
              ref={isFirst ? (el) => { firstSectionRef.current = el } : undefined}
            >
              <MobileSection section={section} index={i} />
            </div>
          )
        })}

        <MobileStars />
        <MobileAcquire onEnquire={onEnquire} />
      </main>
    </div>
  )
}
