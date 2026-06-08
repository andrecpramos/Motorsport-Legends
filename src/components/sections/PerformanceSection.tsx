import { useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { StatCounter } from '../ui/StatCounter'
import { SECTIONS } from '../../constants/sections'

const section = SECTIONS.find((s) => s.id === 'engine')!

const SEC_START = 0.27
const SEC_MID   = 0.35

interface PerformanceSectionProps {
  visible: boolean
  progressRef: React.MutableRefObject<number>
}

export function PerformanceSection({ visible, progressRef }: PerformanceSectionProps) {
  const hasSeen  = useRef(false)
  const blockRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (visible) hasSeen.current = true }, [visible])

  useEffect(() => {
    let raf: number
    const tick = () => {
      if (blockRef.current) {
        const p = progressRef.current
        const t = Math.max(0, Math.min(1, (p - SEC_START) / (SEC_MID - SEC_START)))
        const eased = 1 - Math.pow(1 - t, 3)
        blockRef.current.style.transform = `translateX(${-eased * 28}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progressRef])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={hasSeen.current ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65 }}
        >
          {/* Top-left — title (unconstrained) + copy (max-w on paragraph only) */}
          <div ref={blockRef} className="absolute top-20 left-10 md:left-16">
            <SectionTitle subtitle={section.subtitle} title={section.title} seen={hasSeen.current} />
            <motion.p
              className="font-body text-[13px] italic text-ink/68 leading-loose mt-4 max-w-xs"
              initial={hasSeen.current ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {section.copy}
            </motion.p>
          </div>

          {/* Bottom — stats spread edge to edge */}
          <motion.div
            className="absolute bottom-10 left-10 right-10 md:left-16 md:right-16 flex flex-wrap justify-between gap-y-6"
            initial={hasSeen.current ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {section.stats?.map((stat, i) => (
              <StatCounter key={stat.label} stat={stat} index={i} seen={hasSeen.current} />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
