import { useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { StatCounter } from '../ui/StatCounter'
import { SECTIONS } from '../../constants/sections'

const section = SECTIONS.find((s) => s.id === 'legacy')!

export function LegacySection({ visible }: { visible: boolean }) {
  const hasSeen = useRef(false)
  useEffect(() => { if (visible) hasSeen.current = true }, [visible])

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
          {/* Top-left — title (unconstrained) + copy */}
          <div className="absolute top-20 left-10 md:left-16">
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
