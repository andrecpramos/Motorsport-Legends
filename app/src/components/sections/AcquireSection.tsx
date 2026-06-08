import { useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { SECTIONS } from '../../constants/sections'

const section = SECTIONS.find((s) => s.id === 'acquire')!

export function AcquireSection({ visible, onEnquire }: { visible: boolean; onEnquire: () => void }) {
  const hasSeen = useRef(false)
  useEffect(() => { if (visible) hasSeen.current = true }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 flex flex-col justify-center items-end pr-10 md:pr-20 pointer-events-none"
          initial={hasSeen.current ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Right-side content block — car is on the left */}
          <div className="text-right space-y-6 w-[min(320px,42vw)]">
            <SectionTitle
              subtitle={section.subtitle}
              title={section.title}
              seen={hasSeen.current}
              align="right"
            />

            <motion.p
              className="font-body text-[13px] italic text-ink/80 leading-loose"
              initial={hasSeen.current ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {section.copy}
            </motion.p>

            <motion.div
              className="flex flex-col items-end gap-3 pointer-events-auto"
              initial={hasSeen.current ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <button
                onClick={onEnquire}
                aria-label="Open private enquiry form"
                className="group relative px-9 py-3 border border-accent/55 font-body text-[11px] tracking-[0.35em] text-accent uppercase overflow-hidden transition-colors duration-400 hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="absolute inset-0 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative">Enquire Privately</span>
              </button>
              <button
                onClick={onEnquire}
                aria-label="Request provenance documentation"
                className="px-9 py-3 border border-ink/28 font-body text-[11px] tracking-[0.35em] text-ink/80 uppercase hover:border-accent/50 hover:text-ink transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                View Provenance
              </button>
            </motion.div>

            <motion.p
              className="font-body text-[10px] tracking-[0.3em] text-ink/70 uppercase"
              initial={hasSeen.current ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              By appointment only
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
