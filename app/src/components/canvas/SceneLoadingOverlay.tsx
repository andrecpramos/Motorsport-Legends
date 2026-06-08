import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'

interface SceneLoadingOverlayProps {
  bg:        string   // CSS colour — matches scene background
  name:      string   // Car name shown during load
  accentRgb: string   // "R,G,B" used inside rgba()
}

/**
 * Loading overlay for 3D car scenes.
 *
 * Handles two cases:
 *  1. First visit   — model downloads; shows real progress bar, dismisses when done.
 *  2. Cached visit  — model is already in memory; `active` is immediately false,
 *                     so we dismiss after a brief hold (no permanent blocking).
 *
 * The original bug was: `hasStarted.current && !active` never became true on
 * cached visits because `hasStarted` stays false when nothing loads.
 */
export function SceneLoadingOverlay({ bg, name, accentRgb }: SceneLoadingOverlayProps) {
  const { active, progress } = useProgress()
  const [dismissed, setDismissed]  = useState(false)
  const hasStarted                  = useRef(false)

  useEffect(() => {
    if (active) {
      // Loading is in progress — mark that we've started, cancel any pending dismiss.
      hasStarted.current = true
      return
    }

    // `active` is false — either loading just finished or model was already cached.
    // Cached: hasStarted.current is false → dismiss quickly (100 ms feels instant).
    // Finished: hasStarted.current is true → hold briefly so the model is visible first.
    const delay = hasStarted.current ? 220 : 100
    const t = setTimeout(() => setDismissed(true), delay)
    return () => clearTimeout(t)
  }, [active])

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          style={{ background: bg }}
          aria-live="polite"
          aria-label={active ? `Loading ${name}, ${Math.round(progress)} percent` : undefined}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div className="flex flex-col items-center gap-5">
            <p
              className="font-display font-light italic text-xl tracking-[0.5em]"
              style={{ color: 'rgba(220,215,205,0.35)' }}
            >
              {name}
            </p>
            <div
              className="w-28 h-px relative overflow-hidden"
              style={{ background: 'rgba(220,215,205,0.10)' }}
            >
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{ background: `rgba(${accentRgb},0.70)` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2, ease: 'linear' }}
              />
            </div>
            {active && (
              <p
                className="font-body text-[10px] tracking-[0.35em] uppercase"
                style={{ color: `rgba(${accentRgb},0.55)` }}
              >
                {Math.round(progress)}%
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
