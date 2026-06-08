import { useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { FeatureTag } from '../ui/FeatureTag'
import { SECTIONS } from '../../constants/sections'

const section = SECTIONS.find((s) => s.id === 'doors')!

export function DoorsSection({ visible }: { visible: boolean }) {
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
          {/* Top-right — title (unconstrained) + copy */}
          <div className="absolute top-20 right-10 md:right-16 text-right">
            <SectionTitle subtitle={section.subtitle} title={section.title} seen={hasSeen.current} align="right" />
            <motion.p
              className="font-body text-[13px] italic text-ink/68 leading-loose mt-4 max-w-xs ml-auto"
              initial={hasSeen.current ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {section.copy}
            </motion.p>
          </div>

          {/* Bottom-left — feature list */}
          <div className="absolute bottom-14 left-10 md:left-16 space-y-3.5">
            {section.features?.map((f, i) => (
              <FeatureTag key={f} label={f} index={i} seen={hasSeen.current} />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
