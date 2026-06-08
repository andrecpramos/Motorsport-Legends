import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface BackButtonProps {
  progressRef: React.MutableRefObject<number>
}

export function BackButton({ progressRef: _ }: BackButtonProps) {
  return (
    <motion.div
      className="fixed top-6 left-10 md:left-16 z-50"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
          <Link
            to="/"
            aria-label="Back to all cars"
            className="group flex items-center gap-2.5 pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {/* Arrow pointing left */}
            <div
              className="flex items-center justify-center w-5 h-5 border border-ink/20 transition-all duration-300 group-hover:border-accent/50"
              style={{ background: 'rgba(8,7,5,0.55)', backdropFilter: 'blur(8px)' }}
            >
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path
                  d="M6.5 1.5L3 5l3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ink/70 group-hover:text-accent transition-colors duration-300"
                />
              </svg>
            </div>
          </Link>
    </motion.div>
  )
}
