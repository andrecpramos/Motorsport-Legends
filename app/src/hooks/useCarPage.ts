import { useEffect, useRef, useState } from 'react'
import type { Section } from '../types'

export function getActiveSectionId(sections: Section[], progress: number): string {
  for (const s of sections) {
    if (progress >= s.progressStart && progress <= s.progressEnd) return s.id
  }
  return sections[sections.length - 1].id
}

export function useActiveSection(
  sections: Section[],
  progressRef: React.MutableRefObject<number>,
): string {
  const [activeId, setActiveId] = useState(sections[0].id)
  const prevId = useRef(sections[0].id)

  useEffect(() => {
    let rafId: number
    const tick = () => {
      const next = getActiveSectionId(sections, progressRef.current)
      if (next !== prevId.current) {
        prevId.current = next
        setActiveId(next)
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [progressRef, sections])

  return activeId
}

export function scrollToSection(totalScrollHeight: string, progressStart: number): void {
  const multiplier = parseFloat(totalScrollHeight) / 100
  window.scrollTo({ top: progressStart * multiplier * window.innerHeight, behavior: 'smooth' })
}
