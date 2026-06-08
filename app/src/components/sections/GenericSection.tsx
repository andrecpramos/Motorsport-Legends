import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionTitle } from '../ui/SectionTitle'
import { FeatureTag } from '../ui/FeatureTag'
import { StatCounter } from '../ui/StatCounter'
import { ScrollIndicator } from '../ui/ScrollIndicator'
import type { Section } from '../../types'

interface GenericSectionProps {
  section:      Section
  visible:      boolean
  isFirst?:     boolean
  progressRef?: React.MutableRefObject<number>
  storageKey?:  string
  brandLabel?:  string
  brandYear?:   string
  onEnquire?:   () => void
}

export function GenericSection({
  section,
  visible,
  isFirst,
  progressRef,
  storageKey,
  brandLabel,
  brandYear,
  onEnquire,
}: GenericSectionProps) {
  const hasSeen = useRef(false)
  useEffect(() => { if (visible) hasSeen.current = true }, [visible])

  const hasStats    = !!section.stats?.length
  const hasFeatures = !!section.features?.length
  const isAcquire   = section.id === 'acquire'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={hasSeen.current ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isFirst ? 1 : 0.65 }}
        >

          {/* ── HERO / FIRST SECTION ──────────────────────────────── */}
          {isFirst && (
            <>
              {brandLabel && (
                <motion.div
                  className="absolute top-8 left-20 md:left-24"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <p className="font-body text-[10px] tracking-[0.55em] text-accent/85 uppercase italic">
                    {brandLabel}
                  </p>
                </motion.div>
              )}

              {brandYear && (
                <motion.div
                  className="absolute top-8 right-10 md:right-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <p className="font-body text-[10px] tracking-[0.45em] text-ink/75 uppercase">
                    {brandYear}
                  </p>
                </motion.div>
              )}

              {/* Bottom-left — main title block, exact match to HeroSection */}
              <div className="absolute bottom-16 left-10 md:left-16">
                <div className="overflow-hidden pt-2 pb-3 mb-1">
                  <motion.h1
                    className="font-display font-light italic text-ink leading-none"
                    style={{ fontSize: 'clamp(4.5rem, 12vw, 10rem)' }}
                    initial={{ y: '105%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.4, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {section.title}
                  </motion.h1>
                </div>
                <div className="overflow-hidden pt-1 pb-2">
                  <motion.p
                    className="font-display font-light text-accent leading-none tracking-[0.14em]"
                    style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3.5rem)' }}
                    initial={{ y: '105%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.6, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {section.subtitle}
                  </motion.p>
                </div>

                <motion.div
                  className="h-px w-16 bg-accent/35 origin-left mt-5"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2.0, duration: 1.8, ease: 'easeOut' }}
                  style={{ transformOrigin: 'left center' }}
                />

                <motion.p
                  className="font-body text-[13px] italic text-ink/75 mt-3 leading-relaxed max-w-[220px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2, duration: 1 }}
                >
                  {section.copy.split('.')[0]}.
                </motion.p>
              </div>

              {progressRef && (
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto">
                  <ScrollIndicator progressRef={progressRef} storageKey={storageKey} />
                </div>
              )}
            </>
          )}

          {/* ── ACQUIRE SECTION — right-aligned, exact match to AcquireSection ── */}
          {!isFirst && isAcquire && (
            <div className="absolute inset-0 flex flex-col justify-center items-end pr-10 md:pr-20">
              <div className="text-right space-y-6 w-[min(320px,42vw)]">
                <SectionTitle
                  subtitle={section.subtitle}
                  title={section.title}
                  seen={hasSeen.current}
                  align="right"
                />

                <motion.p
                  className="font-body text-[13px] italic text-ink/80 leading-loose"
                  initial={hasSeen.current ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {section.copy}
                </motion.p>

                {onEnquire && (
                  <motion.div
                    className="flex flex-col items-end gap-3 pointer-events-auto"
                    initial={hasSeen.current ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                  >
                    <button
                      onClick={onEnquire}
                      aria-label="Open private enquiry form"
                      className="group relative px-9 py-3 border border-accent/55 font-body text-[11px] tracking-[0.35em] text-accent uppercase overflow-hidden transition-colors duration-400 hover:text-background"
                    >
                      <span className="absolute inset-0 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out" />
                      <span className="relative">Enquire Privately</span>
                    </button>
                    <button
                      onClick={onEnquire}
                      aria-label="Request provenance documentation"
                      className="px-9 py-3 border border-ink/18 font-body text-[11px] tracking-[0.35em] text-ink/78 uppercase hover:border-accent/50 hover:text-ink transition-all duration-400"
                    >
                      View Provenance
                    </button>
                    <motion.p
                      className="font-body text-[10px] tracking-[0.3em] text-ink/65 uppercase"
                      initial={hasSeen.current ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      By appointment only
                    </motion.p>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* ── STATS SECTIONS (engine / racing / legacy) ─────────────
               Matches PerformanceSection + LegacySection:
               title at top-left, stats spread across bottom          */}
          {!isFirst && !isAcquire && hasStats && (
            <>
              <div className="absolute top-20 left-10 md:left-16">
                <SectionTitle subtitle={section.subtitle} title={section.title} seen={hasSeen.current} />
                <motion.p
                  className="font-body text-[13px] italic text-ink/68 leading-loose mt-4 max-w-xs"
                  initial={hasSeen.current ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {section.copy}
                </motion.p>
              </div>

              <motion.div
                className="absolute bottom-10 left-10 right-10 md:left-16 md:right-16 flex flex-wrap justify-between gap-y-6"
                initial={hasSeen.current ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {section.stats!.map((stat, i) => (
                  <StatCounter key={stat.label} stat={stat} index={i} seen={hasSeen.current} />
                ))}
              </motion.div>
            </>
          )}

          {/* ── FEATURES SECTIONS (design / doors / interior) ─────────
               Matches DesignSection:
               title + copy at bottom-left, features at bottom-right  */}
          {!isFirst && !isAcquire && !hasStats && hasFeatures && (
            <>
              <div className="absolute bottom-14 left-10 md:left-16">
                <SectionTitle subtitle={section.subtitle} title={section.title} seen={hasSeen.current} />
                <motion.p
                  className="font-body text-[13px] italic text-ink/68 leading-loose mt-4 max-w-xs"
                  initial={hasSeen.current ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {section.copy}
                </motion.p>
              </div>

              <div className="absolute right-10 md:right-16 bottom-14 space-y-3.5">
                {section.features!.map((f, i) => (
                  <FeatureTag key={f} label={f} index={i} seen={hasSeen.current} align="right" />
                ))}
              </div>
            </>
          )}

          {/* ── PLAIN COPY SECTIONS (no stats, no features) ───────────
               Title at top-left, copy below                           */}
          {!isFirst && !isAcquire && !hasStats && !hasFeatures && (
            <div className="absolute top-20 left-10 md:left-16">
              <SectionTitle subtitle={section.subtitle} title={section.title} seen={hasSeen.current} />
              <motion.p
                className="font-body text-[13px] italic text-ink/68 leading-loose mt-4 max-w-xs"
                initial={hasSeen.current ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {section.copy}
              </motion.p>
            </div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
  )
}
