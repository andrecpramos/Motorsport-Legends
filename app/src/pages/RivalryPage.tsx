import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RIVALRIES } from '../constants/rivalries'
import type { RivalryData, RivalryMoment, RivalryVideo } from '../constants/rivalries'
import { PageMeta } from '../components/ui/PageMeta'

// ─── Shared animation variant ─────────────────────────────────────────────────

const fadeUp = {
  hidden:   { opacity: 0, y: 36 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const } },
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <div style={{ height: 1, width: 36, background: 'rgba(176,148,90,0.55)' }} />
      <p
        className="font-body uppercase"
        style={{ fontSize: '0.58rem', letterSpacing: '0.65em', color: 'rgba(176,148,90,0.80)' }}
      >
        {children}
      </p>
    </div>
  )
}

// ─── Photo placeholder — vintage film still ───────────────────────────────────

function PhotoPlaceholder({ caption, year, index }: { caption: string; year: string; index: number }) {
  return (
    <motion.div
      className="flex-shrink-0"
      style={{ width: 'clamp(180px, 20vw, 260px)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Film frame */}
      <div
        style={{
          position: 'relative',
          paddingTop: '72%',
          background: 'rgba(18,14,9,0.95)',
          border: '1px solid rgba(176,148,90,0.22)',
          overflow: 'hidden',
        }}
      >
        {/* Tonal gradient */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(176,148,90,0.07) 0%, rgba(0,0,0,0.25) 60%, rgba(176,148,90,0.04) 100%)',
          }}
        />
        {/* Scan lines */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 6px)',
            pointerEvents: 'none',
          }}
        />
        {/* Centre label */}
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <p
            className="font-display font-light italic"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'rgba(176,148,90,0.13)', lineHeight: 1 }}
          >
            {year}
          </p>
          <div style={{ width: 28, height: 1, background: 'rgba(176,148,90,0.28)' }} />
          <p
            className="font-body uppercase"
            style={{ fontSize: '0.48rem', letterSpacing: '0.5em', color: 'rgba(176,148,90,0.32)', textAlign: 'center', padding: '0 14px' }}
          >
            Archive
          </p>
        </div>
        {/* Sprocket holes */}
        {([0, 1, 2] as const).map(i => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top:    i === 0 ? 5  : i === 1 ? '50%'  : 'auto',
              bottom: i === 2 ? 5  : 'auto',
              right:  5,
              transform: i === 1 ? 'translateY(-50%)' : undefined,
              width: 5, height: 5,
              border: '1px solid rgba(176,148,90,0.22)',
              borderRadius: 1,
            }}
          />
        ))}
      </div>
      {/* Caption */}
      <p
        className="font-body italic"
        style={{ fontSize: '0.60rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.50)', marginTop: 8 }}
      >
        {caption}
      </p>
    </motion.div>
  )
}

// ─── Video frame ──────────────────────────────────────────────────────────────

function VideoFrame({ video, index }: { video: RivalryVideo; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Screen casing */}
      <div
        style={{
          background: 'rgba(10,8,6,0.97)',
          border: '1px solid rgba(176,148,90,0.28)',
          overflow: 'hidden',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            height: 26,
            background: 'rgba(176,148,90,0.07)',
            borderBottom: '1px solid rgba(176,148,90,0.16)',
            display: 'flex', alignItems: 'center',
            paddingLeft: 10, gap: 6,
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(176,148,90,0.38)' }} />
          <p
            className="font-body uppercase"
            style={{ fontSize: '0.48rem', letterSpacing: '0.5em', color: 'rgba(176,148,90,0.52)' }}
          >
            Film Archive
          </p>
        </div>

        {/* Video area */}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#060504' }}>
          {video.youtubeId ? (
            <iframe
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                border: 'none',
                filter: 'sepia(0.3) contrast(0.88)',
              }}
              src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 14,
              }}
            >
              {/* CRT scan lines */}
              <div
                style={{
                  position: 'absolute', inset: 0,
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
                  pointerEvents: 'none',
                }}
              />
              {/* Play icon */}
              <div
                style={{
                  width: 52, height: 52,
                  border: '1.5px solid rgba(176,148,90,0.38)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: 0, height: 0,
                    borderTop: '9px solid transparent',
                    borderBottom: '9px solid transparent',
                    borderLeft: '15px solid rgba(176,148,90,0.55)',
                    marginLeft: 4,
                  }}
                />
              </div>
              <p
                className="font-body italic"
                style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', maxWidth: 180, position: 'relative', zIndex: 1 }}
              >
                Vintage footage — archive pending
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Caption */}
      <div style={{ paddingTop: 12 }}>
        <p
          className="font-display font-light italic"
          style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.35, marginBottom: 5 }}
        >
          {video.title}
        </p>
        <p
          className="font-body italic"
          style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.48)', lineHeight: 1.65 }}
        >
          {video.description}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Moment card ──────────────────────────────────────────────────────────────

function MomentRow({ moment, index, colorA, colorB }: { moment: RivalryMoment; index: number; colorA: string; colorB: string }) {
  const accent = index % 2 === 0 ? colorA : colorB
  return (
    <motion.div
      style={{ display: 'flex', gap: 'clamp(18px, 3vw, 40px)', alignItems: 'flex-start' }}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Big number */}
      <span
        className="font-display font-light italic flex-shrink-0"
        aria-hidden="true"
        style={{
          fontSize: 'clamp(2.5rem, 5vw, 5rem)',
          color: `rgba(${accent},0.16)`,
          lineHeight: 0.88,
          userSelect: 'none',
          minWidth: '2.2ch',
        }}
      >
        {moment.number}
      </span>

      {/* Content */}
      <div style={{ paddingTop: 2 }}>
        <div style={{ height: 1, width: 36, background: `rgba(${accent},0.48)`, marginBottom: 10 }} />
        <h3
          className="font-display font-light italic"
          style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.4rem)', color: 'rgba(255,255,255,0.92)', marginBottom: '0.55rem' }}
        >
          {moment.title}
        </h3>
        <p
          className="font-body italic"
          style={{ fontSize: '0.78rem', lineHeight: 1.90, color: 'rgba(255,255,255,0.62)' }}
        >
          {moment.text}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RivalryPage() {
  const { slug } = useParams<{ slug: string }>()
  const rivalry: RivalryData | undefined = RIVALRIES.find(r => r.slug === slug)

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!rivalry) return <Navigate to="/" replace />

  const { colorA, colorB } = rivalry

  return (
    <>
      <PageMeta
        title={`${rivalry.title} — ${rivalry.subtitle} · Legends`}
        description={rivalry.tagline}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          height: '100svh',
          minHeight: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: '#080705',
        }}
      >
        {/* Two-tone ambient split */}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, rgba(${colorA},0.20) 0%, transparent 48%, rgba(${colorB},0.17) 100%)` }} />
        {/* Centre darkness */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 55% 80% at 50% 50%, rgba(8,7,5,0.72) 0%, transparent 100%)' }} />
        {/* Top/bottom vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,7,5,0.70) 0%, transparent 22%, transparent 72%, rgba(8,7,5,0.80) 100%)' }} />
        {/* Scan lines */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.035) 3px, rgba(0,0,0,0.035) 6px)',
            pointerEvents: 'none',
          }}
        />

        {/* Back link */}
        <Link
          to="/"
          aria-label="Back to timeline"
          style={{
            position: 'absolute', top: 26, left: 26, zIndex: 10,
            display: 'flex', alignItems: 'center', gap: 8,
            textDecoration: 'none',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M10 7H4M7 10 4 7l3-3" stroke="rgba(176,148,90,0.68)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-body uppercase" style={{ fontSize: '0.58rem', letterSpacing: '0.5em', color: 'rgba(176,148,90,0.68)' }}>
            Timeline
          </span>
        </Link>

        {/* Subtitle / year */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{ position: 'relative', zIndex: 2, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{ height: 1, width: 28, background: `rgba(${colorA},0.52)` }} />
          <p className="font-body uppercase" style={{ fontSize: '0.56rem', letterSpacing: '0.6em', color: `rgba(${colorA},0.72)` }}>
            {rivalry.year}
          </p>
          <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(176,148,90,0.45)' }} />
          <p className="font-body uppercase" style={{ fontSize: '0.56rem', letterSpacing: '0.6em', color: `rgba(${colorB},0.72)` }}>
            {rivalry.subtitle}
          </p>
          <div style={{ height: 1, width: 28, background: `rgba(${colorB},0.52)` }} />
        </motion.div>

        {/* Rivals */}
        <div
          style={{
            position: 'relative', zIndex: 2,
            display: 'flex', alignItems: 'center',
            gap: 'clamp(1.5rem, 4vw, 5rem)',
            flexWrap: 'wrap', justifyContent: 'center',
          }}
        >
          {/* Side A */}
          <motion.h2
            className="font-display font-light italic"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 6.5rem)', color: `rgba(${colorA},0.90)`, lineHeight: 1, letterSpacing: '-0.01em' }}
            initial={{ opacity: 0, x: -44 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            {rivalry.sideA}
          </motion.h2>

          {/* vs */}
          <motion.span
            className="font-display font-light italic"
            style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2.8rem)', color: 'rgba(255,255,255,0.24)' }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            vs
          </motion.span>

          {/* Side B */}
          <motion.h2
            className="font-display font-light italic"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 6.5rem)', color: `rgba(${colorB},0.90)`, lineHeight: 1, letterSpacing: '-0.01em' }}
            initial={{ opacity: 0, x: 44 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          >
            {rivalry.sideB}
          </motion.h2>
        </div>

        {/* Tagline */}
        <motion.p
          className="font-body italic"
          style={{
            position: 'relative', zIndex: 2,
            fontSize: 'clamp(0.76rem, 1.4vw, 1rem)',
            color: 'rgba(255,255,255,0.58)',
            marginTop: '2rem', textAlign: 'center',
            maxWidth: 420, lineHeight: 1.75,
            padding: '0 24px',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          {rivalry.tagline}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          style={{
            position: 'absolute', bottom: 26, zIndex: 2,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          aria-hidden="true"
        >
          <p className="font-body uppercase" style={{ fontSize: '0.48rem', letterSpacing: '0.55em', color: 'rgba(255,255,255,0.35)' }}>
            Scroll
          </p>
          <div style={{ width: 1, height: 38, background: 'linear-gradient(to bottom, rgba(176,148,90,0.50), transparent)' }} />
        </motion.div>
      </section>

      {/* ── CONTEXT ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#0a0806', padding: 'clamp(56px,8vw,96px) clamp(24px,10vw,120px)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
            <SectionLabel>Historical Context — {rivalry.contextYear}</SectionLabel>
            <p
              className="font-display font-light italic"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.8rem)', color: 'rgba(255,255,255,0.90)', lineHeight: 1.25, marginBottom: '1.8rem' }}
            >
              {rivalry.title}
            </p>
            <p
              className="font-body italic"
              style={{ fontSize: 'clamp(0.80rem, 1.3vw, 1.0rem)', lineHeight: 1.95, color: 'rgba(255,255,255,0.66)' }}
            >
              {rivalry.context}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── THE RIVALS ───────────────────────────────────────────────────── */}
      <section style={{ background: '#080705', padding: 'clamp(56px,8vw,96px) clamp(24px,8vw,80px)' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
            <SectionLabel>The Rivals</SectionLabel>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(20px,3.5vw,44px)', marginTop: '1.8rem' }}>
            {/* Side A */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: 'clamp(22px,3vw,38px)',
                background: `linear-gradient(135deg, rgba(${colorA},0.11) 0%, rgba(${colorA},0.04) 100%)`,
                border: `1px solid rgba(${colorA},0.25)`,
                borderTop: `2px solid rgba(${colorA},0.68)`,
              }}
            >
              <p className="font-display font-light italic" style={{ fontSize: 'clamp(1.7rem, 2.8vw, 3rem)', color: `rgba(${colorA},0.88)`, lineHeight: 1, marginBottom: '0.9rem' }}>
                {rivalry.sideA}
              </p>
              <div style={{ height: 1, background: `linear-gradient(to right, rgba(${colorA},0.52), transparent)`, marginBottom: '1.1rem' }} />
              <p className="font-body italic" style={{ fontSize: '0.77rem', lineHeight: 1.90, color: 'rgba(255,255,255,0.68)' }}>
                {rivalry.sideABio}
              </p>
            </motion.div>

            {/* Side B */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: 'clamp(22px,3vw,38px)',
                background: `linear-gradient(135deg, rgba(${colorB},0.11) 0%, rgba(${colorB},0.04) 100%)`,
                border: `1px solid rgba(${colorB},0.25)`,
                borderTop: `2px solid rgba(${colorB},0.68)`,
              }}
            >
              <p className="font-display font-light italic" style={{ fontSize: 'clamp(1.7rem, 2.8vw, 3rem)', color: `rgba(${colorB},0.88)`, lineHeight: 1, marginBottom: '0.9rem' }}>
                {rivalry.sideB}
              </p>
              <div style={{ height: 1, background: `linear-gradient(to right, rgba(${colorB},0.52), transparent)`, marginBottom: '1.1rem' }} />
              <p className="font-body italic" style={{ fontSize: '0.77rem', lineHeight: 1.90, color: 'rgba(255,255,255,0.68)' }}>
                {rivalry.sideBBio}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── KEY MOMENTS ──────────────────────────────────────────────────── */}
      <section style={{ background: '#0a0806', padding: 'clamp(56px,8vw,96px) clamp(24px,10vw,120px)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
            <SectionLabel>Key Moments</SectionLabel>
            <p className="font-display font-light italic" style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2rem)', color: 'rgba(255,255,255,0.86)', lineHeight: 1.2, marginBottom: '2.8rem' }}>
              Five moments that defined it.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px,4vw,44px)' }}>
            {rivalry.moments.map((moment, i) => (
              <MomentRow key={moment.number} moment={moment} index={i} colorA={colorA} colorB={colorB} />
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN NARRATIVE ───────────────────────────────────────────────── */}
      <section
        style={{
          background: '#080705',
          padding: 'clamp(56px,8vw,96px) clamp(24px,10vw,120px)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Background year watermark */}
        <p
          aria-hidden="true"
          style={{
            position: 'absolute', top: '50%', right: '-2%',
            transform: 'translateY(-50%)',
            fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
            fontSize: 'clamp(8rem, 20vw, 22rem)',
            color: 'rgba(255,255,255,0.025)',
            lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
          }}
        >
          {rivalry.year}
        </p>

        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
            <SectionLabel>{rivalry.mainNarrativeTitle}</SectionLabel>
            <p
              className="font-display font-light italic"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.8rem)', color: 'rgba(255,255,255,0.88)', lineHeight: 1.2, marginBottom: '2.2rem' }}
            >
              {rivalry.mainNarrativeTitle}
            </p>
            <p
              className="font-body italic"
              style={{ fontSize: 'clamp(0.80rem, 1.3vw, 1.0rem)', lineHeight: 1.98, color: 'rgba(255,255,255,0.65)' }}
            >
              {rivalry.mainNarrative}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── PHOTO GALLERY (film strip) ────────────────────────────────────── */}
      <section style={{ background: '#0a0806', padding: 'clamp(56px,8vw,96px) 0', overflow: 'hidden' }}>
        <div style={{ padding: '0 clamp(24px,10vw,120px)', marginBottom: '2.2rem' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
            <SectionLabel>The Archive</SectionLabel>
            <p className="font-display font-light italic" style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2rem)', color: 'rgba(255,255,255,0.86)' }}>
              Photographs from the era.
            </p>
          </motion.div>
        </div>

        <div style={{ padding: '0 clamp(24px,10vw,120px)' }}>
          {/* Top sprocket strip */}
          <div style={{ display: 'flex', gap: 7, marginBottom: 6, opacity: 0.5 }} aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} style={{ width: 15, height: 9, border: '1px solid rgba(176,148,90,0.22)', borderRadius: 2, flexShrink: 0 }} />
            ))}
          </div>

          {/* Photos */}
          <div
            style={{
              display: 'flex', gap: 'clamp(10px,1.8vw,18px)',
              overflowX: 'auto', paddingBottom: 6,
              scrollbarWidth: 'none',
            }}
          >
            {rivalry.photos.map((photo, i) => (
              <PhotoPlaceholder key={i} caption={photo.caption} year={photo.year} index={i} />
            ))}
          </div>

          {/* Bottom sprocket strip */}
          <div style={{ display: 'flex', gap: 7, marginTop: 6, opacity: 0.5 }} aria-hidden="true">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} style={{ width: 15, height: 9, border: '1px solid rgba(176,148,90,0.22)', borderRadius: 2, flexShrink: 0 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO ARCHIVE ────────────────────────────────────────────────── */}
      <section style={{ background: '#080705', padding: 'clamp(56px,8vw,96px) clamp(24px,10vw,120px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
            <SectionLabel>Moving Pictures</SectionLabel>
            <p className="font-display font-light italic" style={{ fontSize: 'clamp(1.1rem, 2.2vw, 2rem)', color: 'rgba(255,255,255,0.86)', marginBottom: '2.2rem' }}>
              Footage from the archive.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(22px,4vw,48px)' }}>
            {rivalry.videos.map((video, i) => (
              <VideoFrame key={i} video={video} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── LEGACY ───────────────────────────────────────────────────────── */}
      <section style={{ background: '#0a0806', padding: 'clamp(56px,8vw,120px) clamp(24px,10vw,120px)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}>
            <SectionLabel>The Legacy</SectionLabel>
            <p
              className="font-body italic"
              style={{ fontSize: 'clamp(0.80rem, 1.3vw, 1.0rem)', lineHeight: 1.98, color: 'rgba(255,255,255,0.65)' }}
            >
              {rivalry.legacy}
            </p>
          </motion.div>

          {/* End rule */}
          <motion.div
            style={{ marginTop: '3.5rem', display: 'flex', alignItems: 'center', gap: 12 }}
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, rgba(${colorA},0.48), rgba(${colorB},0.48), transparent)` }} />
            <p className="font-body uppercase" style={{ fontSize: '0.52rem', letterSpacing: '0.55em', color: 'rgba(255,255,255,0.25)' }}>
              {rivalry.year}
            </p>
          </motion.div>

          {/* Return link */}
          <motion.div
            style={{ marginTop: '2.8rem' }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Link
              to="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M10 7H4M7 10 4 7l3-3" stroke="rgba(176,148,90,0.68)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-body uppercase" style={{ fontSize: '0.58rem', letterSpacing: '0.5em', color: 'rgba(176,148,90,0.68)' }}>
                Return to Timeline
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
