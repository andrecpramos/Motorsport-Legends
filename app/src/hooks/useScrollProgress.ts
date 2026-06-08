import { useRef, useEffect } from 'react'
import { ScrollTrigger } from '../lib/gsap'

export function useScrollProgress() {
  const progressRef = useRef(0)

  useEffect(() => {
    // Wait one rAF so the 750vh container is fully laid out before GSAP measures it
    let trigger: ReturnType<typeof ScrollTrigger.create>

    const rafId = requestAnimationFrame(() => {
      ScrollTrigger.refresh()

      trigger = ScrollTrigger.create({
        trigger: '#scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          progressRef.current = self.progress
        },
      })
    })

    return () => {
      cancelAnimationFrame(rafId)
      trigger?.kill()
    }
  }, [])

  return progressRef
}
