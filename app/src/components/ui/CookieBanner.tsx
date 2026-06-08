import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CONSENT_KEY = 'legends-cookie-consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Delay until after hero animations settle — prevents fighting with entrance sequence
    const t = setTimeout(() => {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true)
    }, 6000)
    return () => clearTimeout(t)
  }, [])

  const respond = (value: 'accepted' | 'declined') => {
    localStorage.setItem(CONSENT_KEY, value)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-label="Cookie consent"
          className="fixed bottom-6 right-6 z-[200] w-[calc(100%-3rem)] max-w-sm bg-[#141210] border border-ink/15 p-6 shadow-2xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body text-[9px] tracking-[0.4em] text-accent/75 uppercase mb-2">
            Privacy Notice
          </p>
          <p className="font-body text-[12px] text-ink/85 leading-relaxed mb-5">
            We use cookies to analyse site usage and improve your experience.
            No personal data is sold or shared with third parties.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => respond('accepted')}
              className="flex-1 py-2.5 border border-accent/40 font-body text-[10px] tracking-[0.3em] text-accent uppercase hover:bg-accent/10 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141210]"
            >
              Accept
            </button>
            <button
              onClick={() => respond('declined')}
              className="flex-1 py-2.5 border border-ink/15 font-body text-[10px] tracking-[0.3em] text-ink/75 uppercase hover:border-ink/30 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141210]"
            >
              Decline
            </button>
          </div>

          <p className="font-body text-[9px] text-ink/70 mt-3 leading-relaxed">
            <a href="/privacy" className="underline underline-offset-2 hover:text-accent/70 transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60">
              Privacy Policy
            </a>
            {' · '}
            <a href="/terms" className="underline underline-offset-2 hover:text-accent/70 transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60">
              Terms of Service
            </a>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
