import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGLTF } from '@react-three/drei'

// Preload map: route → model path. Called on card hover so the model
// starts downloading before the user navigates to the page.
const MODEL_PRELOAD_MAP: Record<string, string> = {
  '/mercedes':   '/models/gullwing.glb',
  '/ferrari':    '/models/ferrari.glb',
  '/jaguar':     '/models/jaguar.glb',
  '/mclaren':    '/models/mclaren.glb',
  '/porsche911':  '/models/porsche911.glb',
}

// ─── Animated intro panel ─────────────────────────────────────────────────────

function IntroPanel() {
  return (
    <div
      className="flex-shrink-0 flex flex-col items-center justify-center text-center"
      style={{ width: '100vw', height: '100%', paddingBottom: '3vh' }}
    >
      <motion.p
        className="font-body uppercase"
        style={{ fontSize: '0.6rem', letterSpacing: '0.7em', color: 'rgba(176,148,90,0.82)', marginBottom: '1.25rem' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        Automotive History
      </motion.p>

      <div className="overflow-hidden" style={{ marginBottom: '0.25rem' }}>
        <motion.h1
          className="font-display font-light italic text-white leading-[1.05]"
          style={{ fontSize: 'clamp(2.4rem, 4.8vw, 5.5rem)' }}
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          transition={{ delay: 0.45, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
          Legends That Shaped
        </motion.h1>
      </div>
      <div className="overflow-hidden" style={{ marginBottom: '1.5rem' }}>
        <motion.h1
          className="font-display font-light italic leading-[1.05]"
          style={{ fontSize: 'clamp(2.4rem, 4.8vw, 5.5rem)', color: 'rgb(var(--color-accent) / 0.88)' }}
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          transition={{ delay: 0.60, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
          Automotive History
        </motion.h1>
      </div>

      <motion.div
        className="flex items-center gap-3"
        style={{ marginBottom: '1.25rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <div style={{ height: 1, width: 40, background: 'rgba(176,148,90,0.60)' }} />
        <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(176,148,90,0.75)' }} />
        <div style={{ height: 1, width: 20, background: 'rgba(176,148,90,0.40)' }} />
      </motion.div>

      <motion.p
        className="font-body italic"
        style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.70)', lineHeight: 1.7, maxWidth: 280, marginBottom: '2.5rem' }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.7 }}
      >
        Three of the most iconic machines ever built — scroll to explore
      </motion.p>

      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span className="font-body uppercase" style={{ fontSize: '0.55rem', letterSpacing: '0.55em', color: 'rgba(255,255,255,0.52)' }}>
          Scroll
        </span>
        <div style={{ height: 1, width: 28, background: 'rgba(176,148,90,0.45)' }} />
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 5h6M5 2l3 3-3 3" stroke="rgba(176,148,90,0.65)" strokeWidth="1"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </div>
  )
}

// ─── Event types ──────────────────────────────────────────────────────────────

interface MilestoneEvent {
  kind:   'milestone'
  year:   string
  title:  string
  desc:   string
}

interface RivalryEvent {
  kind:    'rivalry'
  year:    string
  title:   string
  desc:    string
  sideA:   string
  sideB:   string
  colorA:  string
  colorB:  string
  href?:   string
}

interface CarEvent {
  kind:   'car'
  year:   string
  title:  string
  sub:    string
  desc:   string
  href?:  string   // optional — historic cars without a showcase page have no href
  brand:  string
  color:  string
  origin: string
}

type TimelineEvent = MilestoneEvent | RivalryEvent | CarEvent

const EVENTS: TimelineEvent[] = [
  // ── 1950 ─────────────────────────────────────────────────────────────────
  {
    kind:  'milestone',
    year:  '1950',
    title: 'Formula 1 Era',
    desc:  'The inaugural FIA World Championship is declared at Silverstone. Grand Prix racing becomes a global obsession.',
  },

  // ── 1954 ─────────────────────────────────────────────────────────────────
  {
    kind:   'car',
    year:   '1954',
    title:  '300 SL',
    sub:    'Gullwing',
    desc:   'The first production car with direct fuel injection. The doors that opened to the sky. Stuttgart engineering becomes automotive art.',
    href:   '/mercedes',
    brand:  'Mercedes-Benz',
    color:  '205, 212, 220',
    origin: 'Stuttgart',
  },

  // ── 1955 ─────────────────────────────────────────────────────────────────
  {
    kind:  'milestone',
    year:  '1955',
    title: 'Le Mans Disaster',
    desc:  'Pierre Levegh\'s Mercedes-Benz 300 SLR becomes airborne on the pit straight. Eighty-three spectators are killed. Mercedes withdraws from racing. The circuit is forever changed.',
  },

  // ── 1957 ─────────────────────────────────────────────────────────────────
  {
    kind:  'milestone',
    year:  '1957',
    title: 'Fangio\'s Greatest Lap',
    desc:  'Down by 48 seconds with 20 laps remaining at the Nürburgring, Juan Manuel Fangio drives the race of the century in a Maserati 250F — breaking the lap record nine times to win. He never races again.',
  },

  // ── 1961 ─────────────────────────────────────────────────────────────────
  {
    kind:   'car',
    year:   '1961',
    title:  'E-Type',
    sub:    'Series I',
    desc:   '"The most beautiful car ever made." Enzo Ferrari\'s own verdict at the Geneva Motor Show.',
    href:   '/jaguar',
    brand:  'Jaguar',
    color:  '45, 140, 70',
    origin: 'Coventry',
  },

  // ── 1962 ─────────────────────────────────────────────────────────────────
  {
    kind:   'car',
    year:   '1962',
    title:  '250 GTO',
    sub:    'Berlinetta',
    desc:   'Built to race. Homologated for the road. Thirty-nine were made and every single one is accounted for.',
    href:   '/ferrari',
    brand:  'Ferrari',
    color:  '215, 45, 38',
    origin: 'Maranello',
  },

  // ── 1963 ─────────────────────────────────────────────────────────────────
  {
    kind:   'car',
    year:   '1963',
    title:  '911',
    sub:    'Urmodell',
    desc:   'Ferdinand Porsche\'s grandson draws a fastback. The air-cooled flat-six behind the rear axle defies every engineering convention — and outlasts all of them. It is still in production.',
    href:   '/porsche911',
    brand:  'Porsche',
    color:  '185, 165, 125',
    origin: 'Zuffenhausen',
  },

  // ── 1966 ─────────────────────────────────────────────────────────────────
  {
    kind:    'rivalry',
    year:    '1966',
    title:   'Ford vs Ferrari',
    desc:    'A $18 million acquisition rejected. Henry Ford II dispatches an army of engineers to Le Mans. The GT40 finishes 1-2-3. Ferrari\'s dynasty ends in a photograph.',
    sideA:   'Ford',
    sideB:   'Ferrari',
    colorA:  '35, 85, 175',
    colorB:  '215, 45, 38',
    href:    '/rivalry/ford-vs-ferrari',
  },

  // ── 1976 ─────────────────────────────────────────────────────────────────
  {
    kind:    'rivalry',
    year:    '1976',
    title:   'Lauda vs Hunt',
    desc:    'Lauda pulls from the rain-soaked Japanese Grand Prix. Hunt wins the title by one point. Six weeks earlier, Lauda walked from a burning car at the Nürburgring.',
    sideA:   'Niki Lauda',
    sideB:   'James Hunt',
    colorA:  '190, 30, 30',
    colorB:  '210, 175, 60',
    href:    '/rivalry/lauda-vs-hunt',
  },

  // ── 1988 ─────────────────────────────────────────────────────────────────
  {
    kind:    'rivalry',
    year:    '1988',
    title:   'Senna vs Prost',
    desc:    'The McLaren MP4/4 wins fifteen of sixteen races — the most dominant season in Formula 1 history. Two teammates. One garage. An enmity that defines a generation.',
    sideA:   'Ayrton Senna',
    sideB:   'Alain Prost',
    colorA:  '210, 60, 45',
    colorB:  '175, 165, 145',
    href:    '/rivalry/senna-vs-prost',
  },

  // ── 1993 ─────────────────────────────────────────────────────────────────
  {
    kind:   'car',
    year:   '1993',
    title:  'McLaren F1',
    sub:    'Road Car',
    desc:   '240 mph. Naturally aspirated. Central driving position. Gordon Murray\'s singular answer to the question of what a road car could be.',
    href:   '/mclaren',
    brand:  'McLaren',
    color:  '220, 95, 20',
    origin: 'Woking',
  },

  // ── 1994 ─────────────────────────────────────────────────────────────────
  {
    kind:  'milestone',
    year:  '1994',
    title: 'Imola',
    desc:  'Three days. Roland Ratzenberger on Saturday. Ayrton Senna on Sunday. Lap seven of the San Marino Grand Prix. Motorsport did not speak for a week.',
  },
]

// ─── Milestone card ───────────────────────────────────────────────────────────

function MilestoneCard({ event, above }: { event: MilestoneEvent; above: boolean }) {
  return (
    <div
      className="flex-shrink-0 flex items-center group"
      style={{ width: 'clamp(185px, 16vw, 230px)', height: '100%' }}
    >
      <div className="w-full relative" style={{ height: '56%' }}>

        {/* Year */}
        <div
          style={{
            position: 'absolute',
            [above ? 'bottom' : 'top']: '52%',
            left: 0,
          }}
        >
          <p
            className="font-display font-light italic transition-colors duration-400 group-hover:opacity-90"
            style={{ fontSize: 'clamp(1.3rem, 1.8vw, 2rem)', color: 'rgba(176,148,90,0.72)' }}
          >
            {event.year}
          </p>
        </div>

        {/* Node */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="rounded-full transition-all duration-400 group-hover:scale-125"
            style={{ width: 5, height: 5, background: 'rgba(176,148,90,0.65)', outline: '1px solid rgba(176,148,90,0.35)', outlineOffset: 2 }}
          />
        </div>

        {/* Card */}
        <div
          className="absolute left-0 right-0 border transition-all duration-400 p-4"
          style={{
            [above ? 'top' : 'bottom']: '52%',
            borderColor: 'rgba(176,148,90,0.35)',
            background: 'rgba(32,26,17,0.94)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <h3
            className="font-display font-light text-white/92 leading-snug mb-1.5 transition-colors duration-300 group-hover:text-white"
            style={{ fontSize: 'clamp(0.85rem, 1.1vw, 1rem)' }}
          >
            {event.title}
          </h3>
          <p
            className="font-body italic leading-relaxed"
            style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.65)' }}
          >
            {event.desc}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Rivalry card ─────────────────────────────────────────────────────────────

function RivalryCard({ event }: { event: RivalryEvent }) {
  const [hovered, setHovered] = useState(false)
  const cA = event.colorA
  const cB = event.colorB

  const cardInner = (
    <>
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(${cA},0.08) 0%, rgba(${cB},0.06) 60%, transparent 100%)`,
        }}
        aria-hidden="true"
      />

      <div
        className="w-full flex flex-col overflow-hidden transition-all duration-500"
        style={{
          height: '70%',
          minHeight: 'clamp(260px, 40vh, 400px)',
          background: hovered ? 'rgba(42,33,22,0.98)' : 'rgba(30,23,15,0.95)',
          backdropFilter: 'blur(16px)',
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          border: `1px solid rgba(${cA},${hovered ? '0.50' : '0.28'})`,
          borderTop: `2px solid rgba(${cA},${hovered ? '0.90' : '0.70'})`,
          boxShadow: hovered ? `0 0 40px 6px rgba(${cA},0.15)` : `0 2px 16px rgba(0,0,0,0.6)`,
          position: 'relative',
        }}
      >
        {/* Gradient top accent bar */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: -2, left: 0, right: 0, height: 2,
            background: `linear-gradient(to right, rgba(${cA},0.9), rgba(${cB},0.9))`,
          }}
        />
        {/* Visual area — split two-tone */}
        <div
          className="flex-shrink-0 relative overflow-hidden"
          style={{
            height: '40%',
            background: `linear-gradient(to right, rgba(${cA},${hovered ? '0.32' : '0.22'}) 0%, rgba(22,17,11,0.6) 50%, rgba(${cB},${hovered ? '0.28' : '0.18'}) 100%)`,
            borderBottom: `1px solid rgba(255,255,255,0.12)`,
            transition: 'all 0.5s',
          }}
        >
          <p className="font-body uppercase absolute top-3 left-4 transition-colors duration-400"
             style={{ fontSize: '0.56rem', letterSpacing: '0.5em', color: `rgba(${cA},${hovered ? '1' : '0.88'})` }}>
            {event.sideA}
          </p>
          <p className="font-body uppercase absolute top-3 right-4 transition-colors duration-400"
             style={{ fontSize: '0.56rem', letterSpacing: '0.5em', color: `rgba(${cB},${hovered ? '1' : '0.88'})` }}>
            {event.sideB}
          </p>

          {/* VS divider */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-display font-light italic" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.4rem)', color: 'rgba(255,255,255,0.30)' }}>
              vs
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-display font-light italic leading-none transition-colors duration-400"
                style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.4rem)', color: hovered ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.88)' }}>
              {event.title}
            </h3>
          </div>

          {/* Year watermark */}
          <span
            aria-hidden="true"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontSize: 'clamp(5rem, 10vw, 12rem)',
              color: 'rgba(255,255,255,0.08)',
              lineHeight: 1,
              position: 'absolute',
              bottom: '-18%',
              right: '-2%',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
            }}
          >
            {event.year}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col justify-between" style={{ flex: 1, padding: '1.1rem 1.3rem', minHeight: 0 }}>
          <div>
            <div className="flex items-baseline gap-3" style={{ marginBottom: '0.6rem' }}>
              <span className="font-display font-light italic transition-colors duration-400"
                    style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.7rem)', color: `rgba(${cA}, ${hovered ? '1' : '0.80'})` }}>
                {event.year}
              </span>
              <div style={{
                height: 1, flex: 1,
                background: `linear-gradient(to right, rgba(${cA},${hovered ? '0.70' : '0.50'}), rgba(${cB},${hovered ? '0.70' : '0.50'}))`,
                transition: 'all 0.5s',
              }} />
            </div>
            <p className="font-body italic transition-colors duration-400"
               style={{ fontSize: '0.70rem', lineHeight: 1.7, color: `rgba(255,255,255,${hovered ? '0.90' : '0.72'})` }}>
              {event.desc}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3">
            <p className="font-body uppercase"
               style={{ fontSize: '0.55rem', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.42)' }}>
              Rivalry
            </p>
            {event.href && (
              <div
                className="flex items-center gap-2 px-4 py-2 transition-all duration-400"
                style={{
                  border: `1px solid rgba(${cA},${hovered ? '0.70' : '0.40'})`,
                  background: `rgba(${cA},${hovered ? '0.18' : '0.08'})`,
                  boxShadow: hovered ? `0 0 12px 2px rgba(${cA},0.12)` : 'none',
                }}
              >
                <span className="font-body uppercase transition-colors duration-400"
                  style={{ fontSize: '0.6rem', letterSpacing: '0.45em', color: `rgba(${cA},1)`, fontWeight: 500 }}>
                  Explore
                </span>
                <svg
                  width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"
                  className="transition-transform duration-300"
                  style={{ transform: hovered ? 'translateX(2px)' : 'translateX(0)' }}
                >
                  <path d="M1 4.5h7M4.5 1l3 3.5-3 3.5" stroke={`rgba(${cA},0.90)`} strokeWidth="1.2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )

  const outerStyle = { width: 'clamp(270px, 25vw, 360px)', height: '100%', position: 'relative' } as const
  const outerClass = "flex-shrink-0 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

  if (!event.href) {
    return (
      <div
        className={outerClass}
        style={outerStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {cardInner}
      </div>
    )
  }

  return (
    <Link
      to={event.href}
      className={outerClass}
      style={outerStyle}
      aria-label={`Explore ${event.title}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {cardInner}
    </Link>
  )
}

// ─── Car card ─────────────────────────────────────────────────────────────────

function CarCard({ car }: { car: CarEvent }) {
  const c = car.color
  const [hovered, setHovered] = useState(false)
  const hasLink = !!car.href

  const handleMouseEnter = () => {
    setHovered(true)
    // Preload the 3D model while the user is reading the card
    if (car.href && MODEL_PRELOAD_MAP[car.href]) {
      useGLTF.preload(MODEL_PRELOAD_MAP[car.href])
    }
  }

  const cardInner = (
    <>
      {/* Outer glow — expands on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(${c},0.13) 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        className="w-full flex flex-col overflow-hidden transition-all duration-500"
        style={{
          height: '70%',
          minHeight: 'clamp(260px, 40vh, 400px)',
          border: `1px solid rgba(${c},${hovered ? '0.70' : '0.42'})`,
          borderTop: `2px solid rgba(${c},${hovered ? '1' : '0.85'})`,
          background: hovered ? 'rgba(42,33,22,0.98)' : 'rgba(30,23,15,0.95)',
          backdropFilter: 'blur(16px)',
          boxShadow: hovered
            ? `0 0 40px 6px rgba(${c},0.22), 0 0 0 1px rgba(${c},0.24), inset 0 1px 0 rgba(${c},0.15)`
            : `0 2px 16px rgba(0,0,0,0.6)`,
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        }}
      >
        {/* Image / visual area */}
        <div
          className="flex-shrink-0 relative overflow-hidden transition-all duration-500"
          style={{
            height: '40%',
            background: hovered
              ? `linear-gradient(150deg, rgba(${c},0.38) 0%, rgba(${c},0.18) 45%, rgba(18,14,9,0.80) 100%)`
              : `linear-gradient(150deg, rgba(${c},0.28) 0%, rgba(${c},0.12) 45%, rgba(18,14,9,0.90) 100%)`,
            borderBottom: `1px solid rgba(${c},${hovered ? '0.38' : '0.25'})`,
          }}
        >
          {/* Year watermark */}
          <span
            className="font-display font-light italic absolute select-none pointer-events-none transition-all duration-500"
            aria-hidden="true"
            style={{
              fontSize: 'clamp(5rem, 10vw, 12rem)',
              color: `rgba(${c},${hovered ? '0.15' : '0.08'})`,
              lineHeight: 1,
              bottom: '-18%',
              right: '-2%',
              whiteSpace: 'nowrap',
            }}
          >
            {car.year}
          </span>

          {/* Brand + origin */}
          <div className="absolute top-3 left-4 flex items-center gap-2">
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: `rgba(${c},${hovered ? '0.95' : '0.65'})`, transition: 'all 0.4s' }} />
            <span
              className="font-body uppercase transition-colors duration-400"
              style={{ fontSize: '0.58rem', letterSpacing: '0.55em', color: `rgba(${c},${hovered ? '0.95' : '0.70'})` }}
            >
              {car.brand}
            </span>
          </div>
          <span
            className="font-body absolute top-3 right-4 transition-colors duration-400"
            style={{ fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: `rgba(255,255,255,${hovered ? '0.55' : '0.42'})` }}
          >
            {car.origin}
          </span>

          {/* Car name */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3
              className="font-display font-light italic leading-none transition-colors duration-400"
              style={{ fontSize: 'clamp(1.7rem, 2.8vw, 3.2rem)', color: hovered ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.90)' }}
            >
              {car.title}
            </h3>
            <p
              className="font-display font-light transition-colors duration-400"
              style={{ fontSize: '0.68rem', letterSpacing: '0.09em', color: `rgba(${c},${hovered ? '1' : '0.80'})`, marginTop: '0.15rem' }}
            >
              {car.sub}
            </p>
          </div>
        </div>

        {/* Body */}
        <div
          className="flex flex-col justify-between"
          style={{ flex: 1, padding: '1.1rem 1.3rem', minHeight: 0 }}
        >
          <div>
            <div className="flex items-baseline gap-3" style={{ marginBottom: '0.6rem' }}>
              <span
                className="font-display font-light italic transition-colors duration-400"
                style={{ fontSize: 'clamp(1.2rem, 1.7vw, 1.9rem)', color: `rgba(${c},${hovered ? '1' : '0.82'})` }}
              >
                {car.year}
              </span>
              <div
                className="transition-all duration-500"
                style={{
                  height: 1,
                  flex: 1,
                  background: `linear-gradient(to right, rgba(${c},${hovered ? '0.80' : '0.55'}), transparent)`,
                }}
              />
            </div>
            <p
              className="font-body italic transition-colors duration-400"
              style={{ fontSize: '0.70rem', lineHeight: 1.7, color: `rgba(255,255,255,${hovered ? '0.90' : '0.72'})` }}
            >
              {car.desc}
            </p>
          </div>

          {/* Explore CTA — only shown when the car has its own showcase page */}
          {hasLink && (
            <div
              className="flex items-center gap-2.5 px-4 py-2 mt-3 transition-all duration-400"
              style={{
                border: `1px solid rgba(${c},${hovered ? '0.70' : '0.40'})`,
                background: `rgba(${c},${hovered ? '0.18' : '0.08'})`,
                alignSelf: 'flex-start',
                boxShadow: hovered ? `0 0 16px 2px rgba(${c},0.14)` : 'none',
              }}
            >
              <span
                className="font-body uppercase transition-colors duration-400"
                style={{ fontSize: '0.6rem', letterSpacing: '0.45em', color: `rgba(${c},1)`, fontWeight: 500 }}
              >
                Explore
              </span>
              <svg
                width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"
                className="transition-transform duration-300"
                style={{ transform: hovered ? 'translateX(2px)' : 'translateX(0)', color: `rgba(${c},0.90)` }}
              >
                <path d="M1 4.5h7M4.5 1l3 3.5-3 3.5" stroke="currentColor" strokeWidth="1.2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </>
  )

  // Historic cars (no href) render as a div; showcase cars render as a Link
  if (!hasLink) {
    return (
      <div
        className="flex-shrink-0 flex items-center"
        style={{ width: 'clamp(270px, 25vw, 360px)', height: '100%', position: 'relative' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
      >
        {cardInner}
      </div>
    )
  }

  return (
    <Link
      to={car.href!}
      className="flex-shrink-0 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      style={{ width: 'clamp(270px, 25vw, 360px)', height: '100%', position: 'relative' }}
      aria-label={`Explore the ${car.brand} ${car.title}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      {cardInner}
    </Link>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const isReload     = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type === 'reload'
  const savedX       = isReload ? 0 : parseFloat(sessionStorage.getItem('timeline-x') ?? '0')
  const targetX      = useRef(savedX)
  const currentX     = useRef(savedX)
  const raf          = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    const track     = trackRef.current
    if (!container || !track) return

    // Immediately apply restored position
    track.style.transform = `translateX(${-currentX.current}px)`

    const getMax = () => Math.max(0, track.scrollWidth - container.clientWidth)

    const tick = () => {
      targetX.current = Math.max(0, Math.min(targetX.current, getMax()))
      const diff = targetX.current - currentX.current
      if (Math.abs(diff) > 0.1) {
        currentX.current += diff * 0.09
        track.style.transform = `translateX(${-currentX.current}px)`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetX.current += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    }

    let touchStartX = 0
    let touchStartTarget = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartTarget = targetX.current
    }
    const onTouchMove = (e: TouchEvent) => {
      targetX.current = Math.max(0, Math.min(touchStartTarget + (touchStartX - e.touches[0].clientX), getMax()))
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const STEP = 320
      if (e.key === 'ArrowRight') { e.preventDefault(); targetX.current = Math.min(targetX.current + STEP, getMax()) }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); targetX.current = Math.max(targetX.current - STEP, 0) }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('touchstart', onTouchStart, { passive: true })
    container.addEventListener('touchmove', onTouchMove, { passive: true })
    container.addEventListener('keydown', onKeyDown)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('wheel', onWheel)
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('keydown', onKeyDown)
      sessionStorage.setItem('timeline-x', String(currentX.current))
    }
  }, [])

  let milestoneIdx = 0

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50"
      style={{ height: '100%' }}
      role="region"
      aria-label="Automotive history timeline — use arrow keys to scroll"
      tabIndex={0}
    >
      <div
        ref={trackRef}
        className="flex will-change-transform"
        style={{ height: '100%' }}
      >
        <IntroPanel />

        <div
          className="flex flex-shrink-0 relative"
          style={{ gap: '3.5vw', paddingLeft: '5vw', paddingRight: '14vw', height: '100%', alignItems: 'center' }}
        >
          {/* Axis */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%', left: 0, right: 0,
              height: 1,
              background: 'linear-gradient(to right, transparent, rgba(176,148,90,0.14) 8%, rgba(176,148,90,0.14) 92%, transparent)',
              pointerEvents: 'none',
            }}
          />

          {EVENTS.map((event) => {
            if (event.kind === 'car')     return <CarCard key={`car-${event.year}-${event.title}`} car={event} />
            if (event.kind === 'rivalry') return <RivalryCard key={`rivalry-${event.year}`} event={event} />
            const above = milestoneIdx++ % 2 === 0
            return <MilestoneCard key={`milestone-${event.year}`} event={event} above={above} />
          })}
        </div>
      </div>
    </div>
  )
}
