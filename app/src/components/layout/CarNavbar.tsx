import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Section } from '../../types'
import { scrollToSection } from '../../hooks/useCarPage'

// ─── Collection — all routed car pages ───────────────────────────────────────

const COLLECTION = [
  { path: '/mercedes',  label: 'Gullwing' },
  { path: '/ferrari',   label: '250 GTO'  },
  { path: '/jaguar',    label: 'E-Type'   },
  { path: '/mclaren',   label: 'F1'       },
  { path: '/porsche911', label: '911'     },
  { path: '/porsche917k', label: '917K'  },
] as const

interface CarNavbarProps {
  progressRef:       React.MutableRefObject<number>
  activeId:          string
  onEnquire:         () => void
  sections:          Section[]
  totalScrollHeight: string
  logoTitle:         string
  logoSubtitle:      string
  /** Current route path — used to exclude this car from the switcher */
  currentPath:       string
}

export function CarNavbar({
  progressRef,
  activeId,
  onEnquire,
  sections,
  totalScrollHeight,
  logoTitle,
  logoSubtitle,
  currentPath,
}: CarNavbarProps) {
  const [visible, setVisible] = useState(false)
  const prevVisible = useRef(false)

  useEffect(() => {
    let rafId: number
    const tick = () => {
      const next = progressRef.current > sections[0].progressEnd * 0.8
      if (next !== prevVisible.current) {
        prevVisible.current = next
        setVisible(next)
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [progressRef, sections])

  const otherCars = COLLECTION.filter(c => c.path !== currentPath)

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Main navigation"
          className="fixed top-0 left-0 right-0 z-40 flex items-center px-12 md:px-24 py-5"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-background/80 backdrop-blur-xl absolute inset-0 border-b border-ink/[0.06]" aria-hidden="true" />

          <div className="relative z-10 flex items-center justify-between w-full">
            <Link
              to="/"
              aria-label="Back to all cars"
              className="text-left hover:opacity-70 transition-opacity duration-300"
            >
              <p className="font-display font-light italic text-lg text-ink tracking-wider leading-none">
                {logoTitle}
              </p>
              <p className="font-body text-[9px] tracking-[0.45em] text-accent/75 uppercase mt-0.5">
                {logoSubtitle}
              </p>
            </Link>

            <div className="hidden md:flex items-center gap-10" role="list">
              {sections.slice(1, -1).map((s) => (
                <button
                  key={s.id}
                  role="listitem"
                  aria-current={activeId === s.id ? 'page' : undefined}
                  onClick={() => scrollToSection(totalScrollHeight, s.progressStart)}
                  className={`font-body text-[11px] tracking-[0.25em] uppercase italic transition-colors duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    activeId === s.id ? 'text-accent' : 'text-ink/85 hover:text-accent'
                  }`}
                >
                  {s.title.replace('THE ', '')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-5">
              {/* Cross-car switcher — visible on wide screens only */}
              <div className="hidden xl:flex items-center gap-3" aria-label="Other cars">
                <span className="w-px h-3 bg-ink/20" aria-hidden="true" />
                {otherCars.map((car, i) => (
                  <span key={car.path} className="flex items-center gap-3">
                    {i > 0 && <span className="text-ink/18 font-body text-[9px]" aria-hidden="true">·</span>}
                    <Link
                      to={car.path}
                      className="font-body text-[9px] tracking-[0.28em] text-ink/70 uppercase hover:text-accent transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60"
                    >
                      {car.label}
                    </Link>
                  </span>
                ))}
              </div>

              <button
                onClick={onEnquire}
                aria-label="Open enquiry form"
                className="px-6 py-2 border border-accent/40 font-body text-[10px] tracking-[0.3em] text-accent uppercase hover:bg-accent/10 transition-colors duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Enquire
              </button>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
