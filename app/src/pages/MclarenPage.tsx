import { useEffect, useState } from 'react'
import { PageMeta } from '../components/ui/PageMeta'
import { CarSchemaOrg } from '../components/ui/SchemaOrg'
import { useIsMobile } from '../hooks/useIsMobile'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { MclarenScene } from '../components/canvas/MclarenScene'
import { GenericSection } from '../components/sections/GenericSection'
import { StarSection } from '../components/sections/StarSection'
import { ProgressBar } from '../components/ui/ProgressBar'
import { BackButton } from '../components/ui/BackButton'
import { EnquiryModal } from '../components/ui/EnquiryModal'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { CarMobilePage } from '../components/ui/CarMobilePage'
import { CarNavbar } from '../components/layout/CarNavbar'
import { useActiveSection, scrollToSection } from '../hooks/useCarPage'
import { MCLAREN_SECTIONS, MCLAREN_TOTAL_SCROLL_HEIGHT } from '../constants/mclarenSections'

// McLaren accent: Papaya Orange
const MCLAREN_ACCENT = '220 95 20'

const MCLAREN_OWNERS = [
  { name: 'Rowan Atkinson',     role: 'Actor & Racer'        },
  { name: 'Jay Leno',           role: 'Comedian & Collector' },
  { name: 'Ralph Lauren',       role: 'Fashion Designer'     },
  { name: 'Nick Mason',         role: 'Pink Floyd — Drummer' },
  { name: 'Sultan of Brunei',   role: 'Sovereign'            },
  { name: 'Elon Musk',          role: 'Entrepreneur'         },
  { name: 'Michael Schumacher', role: 'Formula 1 Champion'   },
  { name: 'Mansour Ojjeh',      role: 'TAG Group'            },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MclarenPage() {
  const isMobile    = useIsMobile()
  const progressRef = useScrollProgress()
  const activeId    = useActiveSection(MCLAREN_SECTIONS, progressRef)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (isMobile) return (
    <>
      <CarMobilePage
        brandLabel="McLaren"
        carName="F1"
        year="1993"
        origin="Woking"
        sections={MCLAREN_SECTIONS}
        owners={MCLAREN_OWNERS}
        starsTitle="THE REGISTER"
        starsSubtitle="Those Who Understood"
        starsCopy="One hundred and six were built. Each found an owner who grasped that the F1 was not a possession — it was a responsibility."
        accentCss="220 95 20"
        bgCss="11 8 5"
        surfaceCss="18 12 7"
        onEnquire={() => setModalOpen(true)}
      />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} subject="McLaren F1" />
    </>
  )

  return (
    <div style={{ '--color-accent': MCLAREN_ACCENT, '--color-background': '11 8 5', '--color-surface': '18 12 7' } as React.CSSProperties}>
      <PageMeta
        title="McLaren F1 — Legends Classic Automobiles"
        description="The fastest naturally aspirated road car ever made. 240 mph. 627 horsepower. One hundred and six built. Explore the 1993 McLaren F1 in an immersive 3D showcase."
      />
      <CarSchemaOrg
        name="McLaren F1"
        description="The fastest naturally aspirated road car ever made. 240 mph, 627 HP. 1993, Woking."
        brand="McLaren"
        modelDate="1993"
        url="https://legends.cars/mclaren"
      />
      <ProgressBar progressRef={progressRef} />
      <BackButton progressRef={progressRef} />
      <CarNavbar
        progressRef={progressRef}
        activeId={activeId}
        onEnquire={() => setModalOpen(true)}
        sections={MCLAREN_SECTIONS}
        totalScrollHeight={MCLAREN_TOTAL_SCROLL_HEIGHT}
        logoTitle="F1"
        logoSubtitle="McLaren"
        currentPath="/mclaren"
      />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} subject="McLaren F1" />

      <div id="scroll-container" style={{ height: MCLAREN_TOTAL_SCROLL_HEIGHT }}>
        <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>

          <ErrorBoundary carName="McLaren F1">
            <MclarenScene progressRef={progressRef} />
          </ErrorBoundary>

          {/* McLaren atmospheric orange glow */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 72% 55% at 50% 62%, rgba(220,95,10,0.20) 0%, transparent 65%)',
            }}
          />
          {/* Dark corner vignette */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(8,4,2,0.32) 100%)',
            }}
          />
          {/* Floor bleed — warm orange from below */}
          <div
            className="absolute inset-x-0 bottom-0 z-[1] pointer-events-none"
            style={{
              height: '35%',
              background: 'linear-gradient(to top, rgba(180,70,5,0.16) 0%, transparent 100%)',
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
            {MCLAREN_SECTIONS.map((section, idx) => section.id === 'stars' ? (
              <StarSection
                key="stars"
                visible={activeId === 'stars'}
                title="THE REGISTER"
                subtitle="Those Who Understood"
                copy="One hundred and six were built. Each found an owner who grasped that the F1 was not a possession — it was a responsibility."
                owners={[
                  { name: 'Rowan Atkinson',   role: 'Actor & Racer'          },
                  { name: 'Jay Leno',         role: 'Comedian & Collector'    },
                  { name: 'Ralph Lauren',     role: 'Fashion Designer'        },
                  { name: 'Nick Mason',       role: 'Pink Floyd — Drummer'    },
                  { name: 'Sultan of Brunei', role: 'Sovereign'               },
                  { name: 'Elon Musk',        role: 'Entrepreneur'            },
                  { name: 'Michael Schumacher', role: 'Formula 1 Champion'   },
                  { name: 'Mansour Ojjeh',    role: 'TAG Group'               },
                ]}
              />
            ) : (
              <GenericSection
                key={section.id}
                section={section}
                visible={activeId === section.id}
                isFirst={idx === 0}
                progressRef={idx === 0 ? progressRef : undefined}
                storageKey={idx === 0 ? 'mclaren-has-scrolled' : undefined}
                brandLabel={idx === 0 ? 'McLaren' : undefined}
                brandYear={idx === 0 ? 'Est. 1993' : undefined}
                onEnquire={() => setModalOpen(true)}
              />
            ))}
          </div>

          {/* Section indicators */}
          <nav
            aria-label="Section navigation"
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3"
          >
            {MCLAREN_SECTIONS.map((s) => (
              <button
                key={s.id}
                aria-label={`Go to ${s.title} section`}
                aria-current={activeId === s.id ? 'true' : undefined}
                onClick={() => scrollToSection(MCLAREN_TOTAL_SCROLL_HEIGHT, s.progressStart)}
                className={`w-px rounded-full transition-all duration-500 cursor-pointer hover:bg-accent/80 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background ${
                  activeId === s.id ? 'h-8 bg-accent/60' : 'h-1 bg-ink/15'
                }`}
              />
            ))}
          </nav>

          <div className="absolute bottom-8 left-12 md:left-24 z-20 pointer-events-none" aria-hidden="true">
            <p className="font-body text-[10px] tracking-[0.4em] text-ink/30 uppercase">
              {String(MCLAREN_SECTIONS.findIndex(s => s.id === activeId) + 1).padStart(2, '0')} /
              {String(MCLAREN_SECTIONS.length).padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
