/**
 * CarMobilePage — full scrollable mobile experience for Ferrari, McLaren, Jaguar.
 * No WebGL. Typographic hero + all section content + stars register + acquire CTA.
 * Mirrors the Mercedes MobileFallback aesthetic.
 */
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FeatureTag } from './FeatureTag'
import type { Section } from '../../types'

export interface Owner {
  name: string
  role: string
}

export interface CarMobilePageProps {
  brandLabel:    string
  carName:       string
  year:          string
  origin:        string
  sections:      Section[]
  owners:        Owner[]
  starsTitle:    string
  starsSubtitle: string
  starsCopy:     string
  /** Space-separated RGB tuple — e.g. "176 28 20" */
  accentCss:     string
  bgCss:         string
  surfaceCss:    string
  onEnquire:     () => void
}

// ─── Shared fade-up variant ───────────────────────────────────────────────────

const fadeUp = {
  initial:     { opacity: 0, y: 22 } as const,
  whileInView: { opacity: 1, y: 0  } as const,
  viewport:    { once: true, margin: '-12%' as const },
}

// ─── Fixed header ─────────────────────────────────────────────────────────────

function MobileHeader({
  brandLabel, carName, onEnquire,
}: {
  brandLabel: string
  carName:    string
  onEnquire:  () => void
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 bg-background/90 backdrop-blur-xl border-b border-ink/[0.06]">
      <Link to="/" aria-label="Back to all cars" className="hover:opacity-70 transition-opacity duration-300">
        <p className="font-display font-light italic text-base text-ink tracking-wider leading-none">
          {carName}
        </p>
        <p className="font-body text-[8px] tracking-[0.4em] text-accent/60 uppercase mt-0.5">
          {brandLabel}
        </p>
      </Link>
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

// ─── Hero (typographic — no WebGL) ───────────────────────────────────────────

function MobileHero({
  brandLabel, carName, year, origin, nextRef,
}: {
  brandLabel: string
  carName:    string
  year:       string
  origin:     string
  nextRef:    React.RefObject<HTMLElement | null>
}) {
  return (
    <section className="h-[100svh] relative overflow-hidden flex flex-col justify-end pb-24 px-6" aria-label="Hero">
      {/* Atmospheric glow — uses CSS custom property */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 85% 70% at 50% 72%, rgb(var(--color-accent) / 0.14) 0%, transparent 65%)' }}
        aria-hidden="true"
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{ height: '40%', background: 'linear-gradient(to top, rgb(var(--color-background)) 0%, transparent 100%)' }}
        aria-hidden="true"
      />
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{ height: '20%', background: 'linear-gradient(to bottom, rgb(var(--color-background) / 0.6) 0%, transparent 100%)' }}
        aria-hidden="true"
      />

      {/* Top-left brand label */}
      <motion.p
        className="absolute top-20 left-6 font-body text-[9px] tracking-[0.55em] text-accent/50 uppercase italic"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        {brandLabel}
      </motion.p>

      {/* Top-right year */}
      <motion.p
        className="absolute top-20 right-6 font-body text-[9px] tracking-[0.4em] text-ink/22 uppercase"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        Est. {year}
      </motion.p>

      {/* Year watermark */}
      <motion.span
        className="absolute font-display font-light italic pointer-events-none select-none"
        style={{
          fontSize: 'clamp(7rem, 40vw, 14rem)',
          color: 'rgb(var(--color-accent) / 0.055)',
          lineHeight: 1,
          right: '-2%',
          bottom: '18%',
        }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1.2 }}
        aria-hidden="true"
      >
        {year}
      </motion.span>

      {/* Main title */}
      <div className="space-y-2 relative z-10">
        <div className="overflow-hidden pb-1">
          <motion.h1
            className="font-display font-light italic text-ink leading-none"
            style={{ fontSize: 'clamp(4rem, 20vw, 7rem)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            {carName}
          </motion.h1>
        </div>
        <div className="overflow-hidden pb-1">
          <motion.p
            className="font-display font-light text-accent tracking-[0.18em]"
            style={{ fontSize: 'clamp(0.95rem, 4.5vw, 1.8rem)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            {brandLabel.toUpperCase()}
          </motion.p>
        </div>
        <motion.div
          className="w-8 h-px bg-accent/35 mt-4"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          style={{ transformOrigin: 'left' }}
          transition={{ delay: 1.4, duration: 1.0, ease: 'easeOut' }}
        />
        <motion.p
          className="font-body text-[11px] italic text-ink/75 leading-relaxed pt-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          {origin} · {year}
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.button
        className="absolute bottom-10 right-6 flex flex-col items-center gap-2"
        onClick={() => nextRef.current?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to story"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
      >
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-accent/45 to-transparent"
          animate={{ scaleY: [1, 0.35, 1], opacity: [0.45, 1, 0.45] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        />
        <span className="font-body text-[9px] tracking-[0.35em] text-accent/40 uppercase">Scroll</span>
      </motion.button>

      {/* Section counter */}
      <p className="absolute bottom-10 left-6 font-body text-[9px] tracking-[0.4em] text-ink/18 uppercase pointer-events-none">
        01
      </p>
    </section>
  )
}

// ─── Content section ──────────────────────────────────────────────────────────

function MobileSection({
  section, index, total,
}: {
  section: Section
  index:   number
  total:   number
}) {
  const sectionNumber = String(index + 2).padStart(2, '0')
  const totalStr = String(total).padStart(2, '0')

  return (
    <motion.section
      aria-label={section.title}
      className="relative min-h-[88svh] flex flex-col justify-center px-6 py-20 border-t border-ink/[0.07]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.6 }}
    >
      <p className="absolute top-6 right-6 font-body text-[9px] tracking-[0.4em] text-ink/18 uppercase">
        {sectionNumber} / {totalStr}
      </p>

      {/* Left accent line */}
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
          {...fadeUp} transition={{ duration: 0.5 }}
        >
          {section.subtitle}
        </motion.p>

        <motion.h2
          className="font-display font-light italic text-ink leading-none mb-4"
          style={{ fontSize: 'clamp(2.5rem, 12vw, 4.5rem)' }}
          {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
        >
          {section.title}
        </motion.h2>

        <motion.p
          className="font-body text-[13px] italic text-ink/80 leading-loose mt-3 max-w-[340px]"
          {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }}
        >
          {section.copy}
        </motion.p>

        {section.stats && (
          <motion.dl
            className="grid grid-cols-2 gap-x-6 gap-y-7 mt-9"
            {...fadeUp} transition={{ duration: 0.6, delay: 0.25 }}
          >
            {section.stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <dd className="flex items-end gap-1.5">
                  <span
                    className="font-display font-light italic text-ink leading-none"
                    style={{ fontSize: 'clamp(2.2rem, 11vw, 3.2rem)' }}
                  >
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

        {section.features && (
          <motion.ul
            className="mt-9 space-y-3"
            {...fadeUp} transition={{ duration: 0.6, delay: 0.25 }}
          >
            {section.features.map((f, i) => (
              <li key={f}><FeatureTag label={f} index={i} /></li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.section>
  )
}

// ─── Stars / Register ─────────────────────────────────────────────────────────

function MobileStars({
  title, subtitle, copy, owners, sectionIndex, total,
}: {
  title:         string
  subtitle:      string
  copy:          string
  owners:        Owner[]
  sectionIndex:  number
  total:         number
}) {
  const sectionNumber = String(sectionIndex + 1).padStart(2, '0')
  const totalStr = String(total).padStart(2, '0')

  return (
    <motion.section
      aria-label={title}
      className="relative min-h-[100svh] flex flex-col justify-center px-6 py-20 border-t border-ink/[0.07]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.6 }}
    >
      <p className="absolute top-6 right-6 font-body text-[9px] tracking-[0.4em] text-ink/18 uppercase">
        {sectionNumber} / {totalStr}
      </p>
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
          {...fadeUp} transition={{ duration: 0.5 }}
        >
          {subtitle}
        </motion.p>
        <motion.h2
          className="font-display font-light italic text-ink leading-none mb-4"
          style={{ fontSize: 'clamp(2.5rem, 12vw, 4.5rem)' }}
          {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="font-body text-[13px] italic text-ink/80 leading-loose max-w-[300px] mb-10"
          {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
        >
          {copy}
        </motion.p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-7">
          {owners.map((owner, i) => (
            <motion.div
              key={owner.name}
              className="space-y-1"
              {...fadeUp}
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

// ─── Acquire CTA ──────────────────────────────────────────────────────────────

function MobileAcquire({
  section, total, onEnquire,
}: {
  section:   Section
  total:     number
  onEnquire: () => void
}) {
  const totalStr = String(total).padStart(2, '0')

  return (
    <section
      aria-label="Acquire"
      className="relative min-h-[100svh] flex flex-col justify-center items-center px-8 text-center border-t border-ink/[0.07] py-20"
    >
      <p className="absolute top-6 right-6 font-body text-[9px] tracking-[0.4em] text-ink/18 uppercase">
        {totalStr} / {totalStr}
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
          <Link
            to="/"
            className="block w-full py-4 border border-ink/15 font-body text-[11px] tracking-[0.35em] text-ink/78 uppercase text-center hover:border-accent/30 transition-colors duration-300"
          >
            ← All Cars
          </Link>
        </div>

        <p className="font-body text-[9px] tracking-[0.35em] text-ink/60 uppercase pt-1">
          By appointment only
        </p>
      </motion.div>
    </section>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function CarMobilePage({
  brandLabel, carName, year, origin,
  sections, owners,
  starsTitle, starsSubtitle, starsCopy,
  accentCss, bgCss, surfaceCss,
  onEnquire,
}: CarMobilePageProps) {
  const firstSectionRef = useRef<HTMLElement | null>(null)

  const starsSection  = sections.find(s => s.id === 'stars')
  const starsIndex    = sections.findIndex(s => s.id === 'stars')
  const acquireSection = sections[sections.length - 1]
  const contentSections = sections.slice(1).filter(s => s.id !== 'stars' && s.id !== 'acquire')

  return (
    <div
      className="bg-background text-ink overflow-x-hidden"
      style={{
        '--color-accent':     accentCss,
        '--color-background': bgCss,
        '--color-surface':    surfaceCss,
      } as React.CSSProperties}
    >
      <MobileHeader brandLabel={brandLabel} carName={carName} onEnquire={onEnquire} />

      <main>
        <MobileHero
          brandLabel={brandLabel}
          carName={carName}
          year={year}
          origin={origin}
          nextRef={firstSectionRef}
        />

        {contentSections.map((section, i) => (
          <div
            key={section.id}
            ref={i === 0 ? (el) => { firstSectionRef.current = el } : undefined}
          >
            <MobileSection section={section} index={i} total={sections.length} />
          </div>
        ))}

        {starsSection && (
          <MobileStars
            title={starsTitle}
            subtitle={starsSubtitle}
            copy={starsCopy}
            owners={owners}
            sectionIndex={starsIndex}
            total={sections.length}
          />
        )}

        <MobileAcquire
          section={acquireSection}
          total={sections.length}
          onEnquire={onEnquire}
        />
      </main>
    </div>
  )
}
