import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollIndicator } from '../ui/ScrollIndicator'
import { gsap } from '../../lib/gsap'

interface HeroSectionProps {
  visible: boolean
  progressRef: React.MutableRefObject<number>
}

export function HeroSection({ visible, progressRef }: HeroSectionProps) {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lineRef.current) return
    gsap.fromTo(lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.8, delay: 2.0, ease: 'power3.out', transformOrigin: 'left center' }
    )
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Top-left — house mark */}
          <motion.div
            className="absolute top-8 left-20 md:left-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="font-body text-[10px] tracking-[0.55em] text-accent/85 uppercase italic">
              Mercedes-Benz
            </p>
          </motion.div>

          {/* Top-right — year */}
          <motion.div
            className="absolute top-8 right-10 md:right-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="font-body text-[10px] tracking-[0.45em] text-ink/75 uppercase">
              Est. 1954
            </p>
          </motion.div>

          {/* Bottom-left — main title block */}
          <div className="absolute bottom-16 left-10 md:left-16">
            <div className="overflow-hidden pt-2 pb-3 mb-1">
              <motion.h1
                className="font-display font-light italic text-ink leading-none"
                style={{ fontSize: 'clamp(4.5rem, 12vw, 10rem)' }}
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.4, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              >
                300 SL
              </motion.h1>
            </div>
            <div className="overflow-hidden pt-1 pb-2">
              <motion.h1
                className="font-display font-light text-accent leading-none tracking-[0.14em]"
                style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)' }}
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.6, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              >
                GULLWING
              </motion.h1>
            </div>

            <div ref={lineRef} className="h-px w-16 bg-accent/35 origin-left mt-5" />

            <motion.p
              className="font-body text-[13px] italic text-ink/62 mt-3 leading-relaxed max-w-[200px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
            >
              The car that changed everything.
            </motion.p>
          </div>

          {/* Bottom-center — scroll cue */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto">
            <ScrollIndicator progressRef={progressRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
