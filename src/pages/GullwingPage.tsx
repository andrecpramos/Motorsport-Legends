import { useState } from 'react'
import { PageMeta } from '@components/ui/PageMeta'
import { CarSchemaOrg } from '@components/ui/SchemaOrg'
import { useIsMobile } from '@hooks/useIsMobile'
import { useScrollProgress } from '@hooks/useScrollProgress'
import { CarScene } from '@components/canvas/CarScene'
import { HeroSection } from '@components/sections/HeroSection'
import { DesignSection } from '@components/sections/DesignSection'
import { PerformanceSection } from '@components/sections/PerformanceSection'
import { DoorsSection } from '@components/sections/DoorsSection'
import { InteriorSection } from '@components/sections/InteriorSection'
import { LegacySection } from '@components/sections/LegacySection'
import { StarSection } from '@components/sections/StarSection'
import { AcquireSection } from '@components/sections/AcquireSection'
import { Navbar } from '@components/layout/Navbar'
import { ProgressBar } from '@components/ui/ProgressBar'
import { BackButton } from '@components/ui/BackButton'
import { MobileFallback } from '@components/ui/MobileFallback'
import { EnquiryModal } from '@components/ui/EnquiryModal'
import { ErrorBoundary } from '@components/ui/ErrorBoundary'
import { useActiveSection, scrollToSection } from '@hooks/useCarPage'
import { SECTIONS, TOTAL_SCROLL_HEIGHT } from '@constants/sections'

export default function GullwingPage() {
  const isMobile = useIsMobile()
  const progressRef = useScrollProgress()
  const activeId = useActiveSection(SECTIONS, progressRef)
  const [modalOpen, setModalOpen] = useState(false)

  // Modal lives outside the mobile/desktop split so it renders on both
  if (isMobile) return (
    <>
      <MobileFallback onEnquire={() => setModalOpen(true)} />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} subject="Mercedes-Benz 300 SL Gullwing" />
    </>
  )

  return (
    <>
      <PageMeta
        title="Mercedes-Benz 300 SL Gullwing — Legends Classic Automobiles"
        description="The first production car with fuel injection. Explore the iconic 1954 Mercedes-Benz 300 SL Gullwing in an immersive 3D showcase."
      />
      <CarSchemaOrg
        name="Mercedes-Benz 300 SL Gullwing"
        description="The first production car with fuel injection. The doors that opened to the sky. 1954, Stuttgart."
        brand="Mercedes-Benz"
        modelDate="1954"
        url="https://legends.cars/mercedes"
      />
      <ProgressBar progressRef={progressRef} />
      <BackButton progressRef={progressRef} />
      <Navbar progressRef={progressRef} activeId={activeId} onEnquire={() => setModalOpen(true)} />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} subject="Mercedes-Benz 300 SL Gullwing" />

      <div id="scroll-container" style={{ height: TOTAL_SCROLL_HEIGHT }}>
        <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>

          <ErrorBoundary carName="Mercedes-Benz 300 SL Gullwing">
            <CarScene progressRef={progressRef} />
          </ErrorBoundary>

          {/* Bottom reading scrim */}
          <div
            className="absolute inset-x-0 bottom-0 z-[9] pointer-events-none"
            style={{
              height: '28%',
              background: 'linear-gradient(to top, rgb(var(--color-background) / 0.72) 0%, rgb(var(--color-background) / 0.20) 60%, transparent 100%)',
            }}
          />
          {/* Top reading scrim */}
          <div
            className="absolute inset-x-0 top-0 z-[9] pointer-events-none"
            style={{
              height: '18%',
              background: 'linear-gradient(to bottom, rgb(var(--color-background) / 0.55) 0%, transparent 100%)',
            }}
          />

          <div className="absolute inset-0 z-10 pointer-events-none">
            <HeroSection        visible={activeId === 'heritage'}  progressRef={progressRef} />
            <DesignSection      visible={activeId === 'design'}    />
            <PerformanceSection visible={activeId === 'engine'}    progressRef={progressRef} />
            <DoorsSection       visible={activeId === 'doors'}     />
            <InteriorSection    visible={activeId === 'interior'}  />
            <LegacySection      visible={activeId === 'legacy'}    />
            <StarSection        visible={activeId === 'stars'}     />
            <AcquireSection     visible={activeId === 'acquire'}   onEnquire={() => setModalOpen(true)} />
          </div>

          {/* Section indicators — right edge, clickable */}
          <nav
            aria-label="Section navigation"
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3"
          >
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                aria-label={`Go to ${s.title} section`}
                aria-current={activeId === s.id ? 'true' : undefined}
                onClick={() => scrollToSection(TOTAL_SCROLL_HEIGHT, s.progressStart)}
                className={`w-px rounded-full transition-all duration-500 cursor-pointer hover:bg-accent/80 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background ${
                  activeId === s.id ? 'h-8 bg-accent/70' : 'h-1.5 bg-ink/30'
                }`}
              />
            ))}
          </nav>

          {/* Corner — section number */}
          <div className="absolute bottom-8 left-12 md:left-24 z-20 pointer-events-none" aria-hidden="true">
            <p className="font-body text-[10px] tracking-[0.4em] text-ink/52 uppercase">
              {String(SECTIONS.findIndex(s => s.id === activeId) + 1).padStart(2, '0')} /
              {String(SECTIONS.length).padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
