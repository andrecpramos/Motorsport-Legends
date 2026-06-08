import { motion } from 'framer-motion'

interface SectionTitleProps {
  subtitle: string
  title: string
  seen?: boolean
  align?: 'left' | 'right'
}

export function SectionTitle({ subtitle, title, seen = false, align = 'left' }: SectionTitleProps) {
  const textAlign = align === 'right' ? 'text-right' : 'text-left'
  const ruleAlign = align === 'right' ? 'ml-auto' : ''

  return (
    <div className={`space-y-1.5 ${textAlign}`}>

      {/* Vintage rule above subtitle */}
      <motion.div
        className={`h-px bg-accent/30 mb-2 ${ruleAlign}`}
        style={{ width: '2.5rem', transformOrigin: align === 'right' ? 'right center' : 'left center' }}
        initial={seen ? false : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Subtitle */}
      <motion.p
        className="font-body text-[9px] tracking-[0.6em] text-accent/80 uppercase"
        initial={seen ? false : { y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {subtitle}
      </motion.p>

      {/* Title — no overflow-hidden wrapper so wide headings never get clipped */}
      <motion.h2
        className="font-display font-light italic leading-[0.88] text-ink pt-1 pb-2"
        style={{ fontSize: 'clamp(2.8rem, 5.5vw, 5rem)' }}
        initial={seen ? false : { y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h2>

      {/* Rule beneath title */}
      <motion.div
        className={`flex items-center gap-2 mt-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}
        initial={seen ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <div className="h-px bg-accent/25 w-8" />
        <div className="w-[3px] h-[3px] rounded-full bg-accent/35" />
        <div className="h-px bg-accent/15 w-4" />
      </motion.div>

    </div>
  )
}
