import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Stat } from '../../types'

interface StatCounterProps {
  stat: Stat
  index: number
  seen?: boolean
}

export function StatCounter({ stat, index, seen = false }: StatCounterProps) {
  const [display, setDisplay] = useState(seen ? stat.value : '0')
  const rafRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // If user has already seen this section, show the final value immediately
    if (seen) {
      setDisplay(stat.value)
      return
    }

    const target = parseFloat(stat.value)
    const isDecimal = stat.value.includes('.')
    const duration = 1600
    let startTime: number | null = null

    const animate = (now: number) => {
      if (!startTime) startTime = now
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = target * eased
      setDisplay(isDecimal ? current.toFixed(1) : Math.round(current).toString())
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }

    timerRef.current = setTimeout(() => {
      rafRef.current = requestAnimationFrame(animate)
    }, index * 130)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      cancelAnimationFrame(rafRef.current)
    }
  }, [stat.value, index, seen])

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-end gap-1">
        <span className="font-display font-light italic text-5xl md:text-6xl text-ink leading-none tabular-nums">
          {display}
        </span>
        {stat.unit && (
          <span className="font-body text-[11px] text-accent mb-1.5 tracking-widest italic">
            {stat.unit}
          </span>
        )}
      </div>
      <span className="font-body text-[10px] tracking-[0.35em] text-ink/60 uppercase">
        {stat.label}
      </span>
    </motion.div>
  )
}
