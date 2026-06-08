import { useEffect, useRef } from 'react'

interface ProgressBarProps {
  progressRef: React.MutableRefObject<number>
}

// Directly updates DOM width — no React state, no re-renders
export function ProgressBar({ progressRef }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number
    const tick = () => {
      if (barRef.current) {
        barRef.current.style.width = `${progressRef.current * 100}%`
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [progressRef])

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none" aria-hidden="true">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-accent/70 to-accent"
        style={{ width: '0%' }}
      />
    </div>
  )
}
