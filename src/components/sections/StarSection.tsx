import { useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { SECTIONS } from '../../constants/sections'

const defaultSection = SECTIONS.find((s) => s.id === 'stars')!

const DEFAULT_OWNERS = [
  { name: 'Cary Grant',        role: 'Actor'                      },
  { name: 'Clark Gable',       role: 'Actor'                      },
  { name: 'Stirling Moss',     role: 'Racing Driver'              },
  { name: 'Sophia Loren',      role: 'Actress'                    },
  { name: 'Pablo Picasso',     role: 'Artist'                     },
  { name: 'Tony Curtis',       role: 'Actor'                      },
  { name: 'Prince Rainier III',role: 'Sovereign of Monaco'        },
  { name: 'Juan Manuel Fangio',role: 'Formula 1 Champion'         },
]

interface Owner {
  name: string
  role: string
}

interface StarSectionProps {
  visible:   boolean
  title?:    string
  subtitle?: string
  copy?:     string
  owners?:   Owner[]
}

export function StarSection({ visible, title, subtitle, copy, owners }: StarSectionProps) {
  const hasSeen = useRef(false)
  useEffect(() => { if (visible) hasSeen.current = true }, [visible])

  const displayTitle    = title    ?? defaultSection.title
  const displaySubtitle = subtitle ?? defaultSection.subtitle
  const displayCopy     = copy     ?? defaultSection.copy
  const displayOwners   = owners   ?? DEFAULT_OWNERS

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={hasSeen.current ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65 }}
        >
          {/* Top-left — subtitle + title + copy */}
          <div className="absolute top-20 left-10 md:left-16">
            <SectionTitle subtitle={displaySubtitle} title={displayTitle} seen={hasSeen.current} />
            <motion.p
              className="font-body text-[13px] italic text-ink/68 leading-loose mt-4 max-w-xs"
              initial={hasSeen.current ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {displayCopy}
            </motion.p>
          </div>

          {/* Bottom — 4-column owner grid */}
          <motion.div
            className="absolute bottom-10 left-10 right-10 md:left-16 md:right-16"
            initial={hasSeen.current ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
              {displayOwners.map((owner, i) => (
                <motion.div
                  key={owner.name}
                  className="space-y-1"
                  initial={hasSeen.current ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
                >
                  <div className="w-4 h-px bg-accent/40 mb-2" />
                  <p className="font-display font-light italic text-ink/90 text-base leading-snug">
                    {owner.name}
                  </p>
                  <p className="font-body text-[9px] tracking-[0.3em] text-accent/75 uppercase">
                    {owner.role}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
