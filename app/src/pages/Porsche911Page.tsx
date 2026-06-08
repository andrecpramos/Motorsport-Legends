import { useEffect, useState } from 'react'
import { PageMeta } from '../components/ui/PageMeta'
import { CarSchemaOrg } from '../components/ui/SchemaOrg'
import { useIsMobile } from '../hooks/useIsMobile'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { Porsche911Scene } from '../components/canvas/Porsche911Scene'
import { GenericSection } from '../components/sections/GenericSection'
import { StarSection } from '../components/sections/StarSection'
import { ProgressBar } from '../components/ui/ProgressBar'
import { BackButton } from '../components/ui/BackButton'
import { EnquiryModal } from '../components/ui/EnquiryModal'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { CarMobilePage } from '../components/ui/CarMobilePage'
import { CarNavbar } from '../components/layout/CarNavbar'
import { useActiveSection, scrollToSection } from '../hooks/useCarPage'
import { PORSCHE_911_SECTIONS, PORSCHE_911_TOTAL_SCROLL_HEIGHT } from '../constants/porsche911Sections'

// Porsche silver — warm pewter
const PORSCHE_911_ACCENT = '185 165 125'

const PORSCHE_911_CUSTODIANS = [
  { name: 'Vic Elford',       role: 'Monte Carlo Rally Winner' },
  { name: 'Björn Waldegård',  role: 'Works Rally Driver'       },
  { name: 'Peter Falk',       role: 'Chief Development Engineer' },
  { name: 'Herbert Linge',    role: 'Porsche Factory Driver'   },
  { name: 'Helmut Bott',      role: 'Head of Research & Development' },
  { name: 'Bob Holbert',      role: 'American Road Racing Champion' },
  { name: 'Gérard Larrousse', role: 'Works Rally Driver'       },
  { name: 'Peter Schutz',     role: 'CEO, Preserved the 911'   },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Porsche911Page() {
  const isMobile    = useIsMobile()
  const progressRef = useScrollProgress()
  const activeId    = useActiveSection(PORSCHE_911_SECTIONS, progressRef)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (isMobile) return (
    <>
      <CarMobilePage
        brandLabel="Porsche"
        carName="911"
        year="1963"
        origin="Zuffenhausen"
        sections={PORSCHE_911_SECTIONS}
        owners={PORSCHE_911_CUSTODIANS}
        starsTitle="THE CUSTODIANS"
        starsSubtitle="Those Who Drove It"
        starsCopy="The Porsche 911 was driven by engineers, driven by champions, and owned by those who understood that a car could be both practical transport and defining automotive art."
        accentCss="185 165 125"
        bgCss="10 10 12"
        surfaceCss="17 17 19"
        onEnquire={() => setModalOpen(true)}
      />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} subject="Porsche 911 Urmodell" />
    </>
  )

  return (
    <div style={{ '--color-accent': PORSCHE_911_ACCENT, '--color-background': '10 10 12', '--color-surface': '17 17 19' } as React.CSSProperties}>
      <PageMeta
        title="Porsche 911 — Legends Classic Automobiles"
        description="The car that defied convention and outlasted every prediction. The 1963 Porsche 911 Urmodell — sixty years of unbroken evolution. Explore in an immersive 3D showcase."
      />
      <CarSchemaOrg
        name="Porsche 911 Urmodell"
        description="The air-cooled rear-engined sports car that changed everything. 1963, Zuffenhausen."
        brand="Porsche"
        modelDate="1963"
        url="https://legends.cars/porsche911"
      />
      <ProgressBar progressRef={progressRef} />
      <BackButton progressRef={progressRef} />
      <CarNavbar
        progressRef={progressRef}
        activeId={activeId}
        onEnquire={() => setModalOpen(true)}
        sections={PORSCHE_911_SECTIONS}
        totalScrollHeight={PORSCHE_911_TOTAL_SCROLL_HEIGHT}
        logoTitle="911"
        logoSubtitle="Porsche"
        currentPath="/porsche911"
      />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} subject="Porsche 911 Urmodell" />

      <div id="scroll-container" style={{ height: PORSCHE_911_TOTAL_SCROLL_HEIGHT }}>
        <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>

          <ErrorBoundary carName="Porsche 911">
            <Porsche911Scene progressRef={progressRef} />
          </ErrorBoundary>

          {/* Porsche silver ambient glow */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 55% at 50% 60%, rgba(185,165,125,0.10) 0%, transparent 65%)',
            }}
          />
          {/* Corner vignette */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(6,6,8,0.28) 100%)',
            }}
          />
          {/* Floor bleed */}
          <div
            className="absolute inset-x-0 bottom-0 z-[1] pointer-events-none"
            style={{
              height: '35%',
              background: 'linear-gradient(to top, rgba(140,125,80,0.12) 0%, transparent 100%)',
            }}
          />

          <div
            className="absolute inset-x-0 bottom-0 z-[9] pointer-events-none"
            style={{ height: '20%', background: 'linear-gradient(to top, rgb(var(--color-background) / 0.50) 0%, transparent 100%)' }}
          />
          <div
            className="absolute inset-x-0 top-0 z-[9] pointer-events-none"
            style={{ height: '14%', background: 'linear-gradient(to bottom, rgb(var(--color-background) / 0.40) 0%, transparent 100%)' }}
          />

          <div className="absolute inset-0 z-10 pointer-events-none">
            {PORSCHE_911_SECTIONS.map((section, idx) => section.id === 'stars' ? (
              <StarSection
                key="stars"
                visible={activeId === 'stars'}
                title="THE CUSTODIANS"
                subtitle="Those Who Drove It"
                copy="The Porsche 911 was driven by engineers, driven by champions, and owned by those who understood that a car could be both practical transport and defining automotive art."
                owners={PORSCHE_911_CUSTODIANS}
              />
            ) : (
              <GenericSection
                key={section.id}
                section={section}
                visible={activeId === section.id}
                isFirst={idx === 0}
                progressRef={idx === 0 ? progressRef : undefined}
                storageKey={idx === 0 ? 'porsche911-has-scrolled' : undefined}
                brandLabel={idx === 0 ? 'Porsche' : undefined}
                brandYear={idx === 0 ? 'Est. 1963' : undefined}
                onEnquire={() => setModalOpen(true)}
              />
            ))}
          </div>

          {/* Section indicators */}
          <nav
            aria-label="Section navigation"
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3"
          >
            {PORSCHE_911_SECTIONS.map((s) => (
              <button
                key={s.id}
                aria-label={`Go to ${s.title} section`}
                aria-current={activeId === s.id ? 'true' : undefined}
                onClick={() => scrollToSection(PORSCHE_911_TOTAL_SCROLL_HEIGHT, s.progressStart)}
                className={`w-px rounded-full transition-all duration-500 cursor-pointer hover:bg-accent/80 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background ${
                  activeId === s.id ? 'h-8 bg-accent/60' : 'h-1 bg-ink/15'
                }`}
              />
            ))}
          </nav>

          <div className="absolute bottom-8 left-12 md:left-24 z-20 pointer-events-none" aria-hidden="true">
            <p className="font-body text-[10px] tracking-[0.4em] text-ink/30 uppercase">
              {String(PORSCHE_911_SECTIONS.findIndex(s => s.id === activeId) + 1).padStart(2, '0')} /
              {String(PORSCHE_911_SECTIONS.length).padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
