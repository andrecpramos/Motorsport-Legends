import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScrollIndicatorProps {
  progressRef: React.MutableRefObject<number>
  storageKey?: string
}

export function ScrollIndicator({ progressRef, storageKey = 'has-scrolled' }: ScrollIndicatorProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show on first visit to this car page
    if (localStorage.getItem(storageKey)) return

    // Show immediately once the hero animation has had a moment to settle
    const showTimer = setTimeout(() => setVisible(true), 1200)

    // Auto-dismiss after 4 s even if user hasn't scrolled
    const hideTimer = setTimeout(() => {
      setVisible(false)
      localStorage.setItem(storageKey, '1')
    }, 5200)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [storageKey])

  useEffect(() => {
    if (!visible) return
    let rafId: number
    const tick = () => {
      if (progressRef.current > 0.02) {
        setVisible(false)
        localStorage.setItem(storageKey, '1')
      } else {
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [progressRef, storageKey, visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="flex flex-col items-center gap-3"
          aria-hidden="true"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-body text-[10px] tracking-[0.45em] text-accent/65 uppercase">
            Scroll to explore
          </span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-accent/55 to-transparent"
            animate={{ scaleY: [1, 0.3, 1], opacity: [0.55, 1, 0.55] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
