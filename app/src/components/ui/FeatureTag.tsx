import { motion } from 'framer-motion'

interface FeatureTagProps {
  label: string
  index: number
  seen?: boolean
  align?: 'left' | 'right'
}

export function FeatureTag({ label, index, seen = false, align = 'left' }: FeatureTagProps) {
  const initial = seen ? false : { opacity: 0, x: align === 'right' ? 10 : -10 }
  const justify = align === 'right' ? 'flex-row-reverse' : 'flex-row'

  return (
    <motion.div
      className={`flex items-center gap-2.5 ${justify}`}
      initial={initial}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: seen ? 0 : index * 0.07 + 0.2, duration: 0.4 }}
    >
      <div className="w-[3px] h-[3px] rounded-full bg-accent/70 flex-shrink-0 mt-px" />
      <span className="font-body text-[11px] tracking-[0.22em] text-ink/75 uppercase leading-none">
        {label}
      </span>
    </motion.div>
  )
}
