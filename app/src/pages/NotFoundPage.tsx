import { Link } from 'react-router-dom'
import { PageMeta } from '../components/ui/PageMeta'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <>
      <PageMeta title="Not Found — Legends Classic Automobiles" />
      <div
        className="bg-background text-ink min-h-screen flex items-center justify-center"
        style={{ position: 'relative' }}
      >
        {/* Film grain already applied globally via #root::after */}
        <div className="text-center px-8 space-y-8">
          <motion.p
            className="font-body text-[9px] tracking-[0.6em] text-accent/80 uppercase"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            404
          </motion.p>

          <div className="overflow-hidden">
            <motion.h1
              className="font-display font-light italic text-ink leading-none"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              Lost in the showroom
            </motion.h1>
          </div>

          <motion.div
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <div style={{ height: 1, width: 40, background: 'rgba(176,148,90,0.30)' }} />
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(176,148,90,0.45)' }} />
            <div style={{ height: 1, width: 20, background: 'rgba(176,148,90,0.18)' }} />
          </motion.div>

          <motion.p
            className="font-body italic text-ink/75"
            style={{ fontSize: '0.82rem', lineHeight: 1.8 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.7 }}
          >
            The page you're looking for has left the building.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.7 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-8 py-3 border border-accent/35 font-body text-[10px] tracking-[0.4em] text-accent/80 uppercase hover:bg-accent/8 transition-colors duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Return to Collection
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  )
}
