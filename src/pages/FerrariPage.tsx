import { useEffect, useState } from 'react'
import { PageMeta } from '../components/ui/PageMeta'
import { CarSchemaOrg } from '../components/ui/SchemaOrg'
import { useIsMobile } from '../hooks/useIsMobile'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { FerrariScene } from '../components/canvas/FerrariScene'
import { GenericSection } from '../components/sections/GenericSection'
import { StarSection } from '../components/sections/StarSection'
import { ProgressBar } from '../components/ui/ProgressBar'
import { BackButton } from '../components/ui/BackButton'
import { EnquiryModal } from '../components/ui/EnquiryModal'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { CarMobilePage } from '../components/ui/CarMobilePage'
import { CarNavbar } from '../components/layout/CarNavbar'
import { useActiveSection, scrollToSection } from '../hooks/useCarPage'
import { FERRARI_SECTIONS, FERRARI_TOTAL_SCROLL_HEIGHT } from '../constants/ferrariSections'

// Ferrari accent: Rosso Corsa red
const FERRARI_ACCENT = '176 28 20'

const FERRARI_OWNERS = [
  { name: 'Phil Hill',       role: 'Formula 1 World Champion' },
  { name: 'Stirling Moss',   role: 'Racing Driver'            },
  { name: 'Jo Siffert',      role: 'Works Driver'             },
  { name: 'David Piper',     role: 'Privateer Racer'          },
  { name: 'Pedro Rodriguez', role: 'Mexican Racing Driver'    },
  { name: 'Mike Parkes',     role: 'Scuderia Ferrari'         },
  { name: 'Gianni Agnelli',  role: 'Industrialist'            },
  { name: 'Rob Walker',      role: 'Privateer Entrant'        },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FerrariPage() {
  const isMobile    = useIsMobile()
  const progressRef = useScrollProgress()
  const activeId    = useActiveSection(FERRARI_SECTIONS, progressRef)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (isMobile) return (
    <>
      <CarMobilePage
        brandLabel="Ferrari"
        carName="250 GTO"
        year="1962"
        origin="Maranello"
        sections={FERRARI_SECTIONS}
        owners={FERRARI_OWNERS}
        starsTitle="THE DRIVERS"
        starsSubtitle="Those Who Raced It"
        starsCopy="The 250 GTO was not bought. It was allocated — to drivers Ferrari trusted to extract its full measure."
        accentCss="176 28 20"
        bgCss="15 3 3"
        surfaceCss="24 5 5"
        onEnquire={() => setModalOpen(true)}
      />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} subject="Ferrari 250 GTO" />
    </>
  )

  return (
    // Ferrari theme: deep crimson background + Rosso Corsa accent
    <div style={{ '--color-accent': FERRARI_ACCENT, '--color-background': '15 3 3', '--color-surface': '24 5 5' } as React.CSSProperties}>
      <PageMeta
        title="Ferrari 250 GTO — Legends Classic Automobiles"
        description="Built to race. Homologated for the road. Thirty-nine were made. Explore the legendary 1962 Ferrari 250 GTO in an immersive 3D showcase."
      />
      <CarSchemaOrg
        name="Ferrari 250 GTO"
        description="Built to race. Homologated for the road. Thirty-nine were made. 1962, Maranello."
        brand="Ferrari"
        modelDate="1962"
        url="https://legends.cars/ferrari"
      />
      <ProgressBar progressRef={progressRef} />
      <BackButton progressRef={progressRef} />
      <CarNavbar
        progressRef={progressRef}
        activeId={activeId}
        onEnquire={() => setModalOpen(true)}
        sections={FERRARI_SECTIONS}
        totalScrollHeight={FERRARI_TOTAL_SCROLL_HEIGHT}
        logoTitle="250 GTO"
        logoSubtitle="Ferrari"
        currentPath="/ferrari"
      />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} subject="Ferrari 250 GTO" />

      <div id="scroll-container" style={{ height: FERRARI_TOTAL_SCROLL_HEIGHT }}>
        <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>

          <ErrorBoundary carName="Ferrari 250 GTO">
            <FerrariScene progressRef={progressRef} />
          </ErrorBoundary>

          {/* Ferrari atmospheric red glow — layered over 3D canvas */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 75% 60% at 50% 62%, rgba(210,25,12,0.22) 0%, transparent 65%)',
            }}
          />
          {/* Deep red corner vignette */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(120,8,3,0.30) 100%)',
            }}
          />
          {/* Horizontal floor bleed — warm red from below */}
          <div
            className="absolute inset-x-0 bottom-0 z-[1] pointer-events-none"
            style={{
              height: '35%',
              background: 'linear-gradient(to top, rgba(160,15,5,0.18) 0%, transparent 100%)',
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
            {FERRARI_SECTIONS.map((section, idx) => section.id === 'stars' ? (
              <StarSection
                key="stars"
                visible={activeId === 'stars'}
                title="THE DRIVERS"
                subtitle="Those Who Raced It"
                copy="The 250 GTO was not bought. It was allocated — to drivers Ferrari trusted to extract its full measure."
                owners={[
                  { name: 'Phil Hill',        role: 'Formula 1 World Champion' },
                  { name: 'Stirling Moss',    role: 'Racing Driver'            },
                  { name: 'Jo Siffert',       role: 'Works Driver'             },
                  { name: 'David Piper',      role: 'Privateer Racer'          },
                  { name: 'Pedro Rodriguez',  role: 'Mexican Racing Driver'    },
                  { name: 'Mike Parkes',      role: 'Scuderia Ferrari'         },
                  { name: 'Gianni Agnelli',   role: 'Industrialist'            },
                  { name: 'Rob Walker',       role: 'Privateer Entrant'        },
                ]}
              />
            ) : (
              <GenericSection
                key={section.id}
                section={section}
                visible={activeId === section.id}
                isFirst={idx === 0}
                progressRef={idx === 0 ? progressRef : undefined}
                storageKey={idx === 0 ? 'ferrari-has-scrolled' : undefined}
                brandLabel={idx === 0 ? 'Ferrari' : undefined}
                brandYear={idx === 0 ? 'Est. 1962' : undefined}
                onEnquire={() => setModalOpen(true)}
              />
            ))}
          </div>

          {/* Section indicators */}
          <nav
            aria-label="Section navigation"
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3"
          >
            {FERRARI_SECTIONS.map((s) => (
              <button
                key={s.id}
                aria-label={`Go to ${s.title} section`}
                aria-current={activeId === s.id ? 'true' : undefined}
                onClick={() => scrollToSection(FERRARI_TOTAL_SCROLL_HEIGHT, s.progressStart)}
                className={`w-px rounded-full transition-all duration-500 cursor-pointer hover:bg-accent/80 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background ${
                  activeId === s.id ? 'h-8 bg-accent/60' : 'h-1 bg-ink/15'
                }`}
              />
            ))}
          </nav>

          <div className="absolute bottom-8 left-12 md:left-24 z-20 pointer-events-none" aria-hidden="true">
            <p className="font-body text-[10px] tracking-[0.4em] text-ink/30 uppercase">
              {String(FERRARI_SECTIONS.findIndex(s => s.id === activeId) + 1).padStart(2, '0')} /
              {String(FERRARI_SECTIONS.length).padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
