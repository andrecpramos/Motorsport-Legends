import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SECTIONS, TOTAL_SCROLL_HEIGHT } from '../../constants/sections'
import { scrollToSection } from '../../hooks/useCarPage'

const OTHER_CARS = [
  { path: '/ferrari',    label: '250 GTO' },
  { path: '/jaguar',     label: 'E-Type'  },
  { path: '/mclaren',    label: 'F1'      },
  { path: '/porsche911', label: '911'     },
  { path: '/porsche917k', label: '917K'  },
] as const

interface NavbarProps {
  progressRef: React.MutableRefObject<number>
  activeId: string
  onEnquire: () => void
}

const NAV_LINKS = [
  { label: 'Design',    id: 'design'   },
  { label: 'Engine',    id: 'engine'   },
  { label: 'The Doors', id: 'doors'    },
  { label: 'Interior',  id: 'interior' },
  { label: 'Legacy',    id: 'legacy'   },
]


export function Navbar({ progressRef, activeId, onEnquire }: NavbarProps) {
  const [visible, setVisible] = useState(false)
  const prevVisible = useRef(false)

  useEffect(() => {
    let rafId: number
    const tick = () => {
      const next = progressRef.current > 0.13
      if (next !== prevVisible.current) {
        prevVisible.current = next
        setVisible(next)
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [progressRef])

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
            {/* Logo — navigates to homepage */}
            <Link
              to="/"
              aria-label="Back to all cars"
              className="text-left hover:opacity-70 transition-opacity duration-300"
            >
              <p className="font-display font-light italic text-lg text-ink tracking-wider leading-none">
                300 SL
              </p>
              <p className="font-body text-[9px] tracking-[0.45em] text-accent/75 uppercase mt-0.5">
                Gullwing
              </p>
            </Link>

            <div className="hidden md:flex items-center gap-10" role="list">
              {NAV_LINKS.map((link) => {
                const section = SECTIONS.find(s => s.id === link.id)
                const isActive = activeId === link.id
                return (
                  <button
                    key={link.id}
                    role="listitem"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => section && scrollToSection(TOTAL_SCROLL_HEIGHT, section.progressStart)}
                    className={`font-body text-[11px] tracking-[0.25em] uppercase italic transition-colors duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      isActive ? 'text-accent' : 'text-ink/85 hover:text-accent'
                    }`}
                  >
                    {link.label}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-5">
              {/* Cross-car switcher — visible on wide screens only */}
              <div className="hidden xl:flex items-center gap-3" aria-label="Other cars">
                <span className="w-px h-3 bg-ink/20" aria-hidden="true" />
                {OTHER_CARS.map((car, i) => (
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
