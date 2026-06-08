import { useEffect, useState } from 'react'
import { PageMeta } from '../components/ui/PageMeta'
import { CarSchemaOrg } from '../components/ui/SchemaOrg'
import { useIsMobile } from '../hooks/useIsMobile'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { JaguarScene } from '../components/canvas/JaguarScene'
import { GenericSection } from '../components/sections/GenericSection'
import { StarSection } from '../components/sections/StarSection'
import { ProgressBar } from '../components/ui/ProgressBar'
import { BackButton } from '../components/ui/BackButton'
import { EnquiryModal } from '../components/ui/EnquiryModal'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { CarMobilePage } from '../components/ui/CarMobilePage'
import { CarNavbar } from '../components/layout/CarNavbar'
import { useActiveSection, scrollToSection } from '../hooks/useCarPage'
import { JAGUAR_SECTIONS, JAGUAR_TOTAL_SCROLL_HEIGHT } from '../constants/jaguarSections'

// Jaguar accent: British Racing Green
const JAGUAR_ACCENT = '22 90 48'

const JAGUAR_OWNERS = [
  { name: 'Steve McQueen',   role: 'Actor & Racing Driver' },
  { name: 'Frank Sinatra',   role: 'Singer'                },
  { name: 'Brigitte Bardot', role: 'Actress'               },
  { name: 'George Best',     role: 'Footballer'            },
  { name: 'Peter Sellers',   role: 'Actor & Comedian'      },
  { name: 'Tony Curtis',     role: 'Actor'                 },
  { name: 'Graham Hill',     role: 'Formula 1 Champion'    },
  { name: 'Alec Guinness',   role: 'Actor'                 },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JaguarPage() {
  const isMobile    = useIsMobile()
  const progressRef = useScrollProgress()
  const activeId    = useActiveSection(JAGUAR_SECTIONS, progressRef)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (isMobile) return (
    <>
      <CarMobilePage
        brandLabel="Jaguar"
        carName="E-Type"
        year="1961"
        origin="Coventry"
        sections={JAGUAR_SECTIONS}
        owners={JAGUAR_OWNERS}
        starsTitle="THE REGISTER"
        starsSubtitle="Those Who Understood"
        starsCopy="The E-Type did not seek famous owners. It simply had a way of finding those who recognised beauty without instruction."
        accentCss="22 90 48"
        bgCss="2 11 4"
        surfaceCss="4 18 7"
        onEnquire={() => setModalOpen(true)}
      />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} subject="Jaguar E-Type" />
    </>
  )

  return (
    // Jaguar theme: deep forest background + British Racing Green accent
    <div style={{ '--color-accent': JAGUAR_ACCENT, '--color-background': '2 11 4', '--color-surface': '4 18 7' } as React.CSSProperties}>
      <PageMeta
        title="Jaguar E-Type — Legends Classic Automobiles"
        description='"The most beautiful car ever made." Explore the 1961 Jaguar E-Type in an immersive 3D showcase — by appointment only.'
      />
      <CarSchemaOrg
        name="Jaguar E-Type"
        description='"The most beautiful car ever made." — Enzo Ferrari, Geneva 1961. 1961, Coventry.'
        brand="Jaguar"
        modelDate="1961"
        url="https://legends.cars/jaguar"
      />
      <ProgressBar progressRef={progressRef} />
      <BackButton progressRef={progressRef} />
      <CarNavbar
        progressRef={progressRef}
        activeId={activeId}
        onEnquire={() => setModalOpen(true)}
        sections={JAGUAR_SECTIONS}
        totalScrollHeight={JAGUAR_TOTAL_SCROLL_HEIGHT}
        logoTitle="E-Type"
        logoSubtitle="Jaguar"
        currentPath="/jaguar"
      />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} subject="Jaguar E-Type" />

      <div id="scroll-container" style={{ height: JAGUAR_TOTAL_SCROLL_HEIGHT }}>
        <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>

          <ErrorBoundary carName="Jaguar E-Type">
            <JaguarScene progressRef={progressRef} />
          </ErrorBoundary>

          {/* Jaguar atmospheric green glow */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 72% 58% at 48% 60%, rgba(10,100,38,0.22) 0%, transparent 65%)',
            }}
          />
          {/* Deep green corner vignette */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(2,50,14,0.32) 100%)',
            }}
          />
          {/* Horizontal floor bleed — cool green from below */}
          <div
            className="absolute inset-x-0 bottom-0 z-[1] pointer-events-none"
            style={{
              height: '35%',
              background: 'linear-gradient(to top, rgba(5,80,22,0.18) 0%, transparent 100%)',
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
            {JAGUAR_SECTIONS.map((section, idx) => section.id === 'stars' ? (
              <StarSection
                key="stars"
                visible={activeId === 'stars'}
                title="THE REGISTER"
                subtitle="Those Who Understood"
                copy="The E-Type did not seek famous owners. It simply had a way of finding those who recognised beauty without instruction."
                owners={[
                  { name: 'Steve McQueen',   role: 'Actor & Racing Driver'  },
                  { name: 'Frank Sinatra',   role: 'Singer'                 },
                  { name: 'Brigitte Bardot', role: 'Actress'                },
                  { name: 'George Best',     role: 'Footballer'             },
                  { name: 'Peter Sellers',   role: 'Actor & Comedian'       },
                  { name: 'Tony Curtis',     role: 'Actor'                  },
                  { name: 'Graham Hill',     role: 'Formula 1 Champion'     },
                  { name: 'Alec Guinness',   role: 'Actor'                  },
                ]}
              />
            ) : (
              <GenericSection
                key={section.id}
                section={section}
                visible={activeId === section.id}
                isFirst={idx === 0}
                progressRef={idx === 0 ? progressRef : undefined}
                storageKey={idx === 0 ? 'jaguar-has-scrolled' : undefined}
                brandLabel={idx === 0 ? 'Jaguar' : undefined}
                brandYear={idx === 0 ? 'Est. 1961' : undefined}
                onEnquire={() => setModalOpen(true)}
              />
            ))}
          </div>

          {/* Section indicators */}
          <nav
            aria-label="Section navigation"
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3"
          >
            {JAGUAR_SECTIONS.map((s) => (
              <button
                key={s.id}
                aria-label={`Go to ${s.title} section`}
                aria-current={activeId === s.id ? 'true' : undefined}
                onClick={() => scrollToSection(JAGUAR_TOTAL_SCROLL_HEIGHT, s.progressStart)}
                className={`w-px rounded-full transition-all duration-500 cursor-pointer hover:bg-accent/80 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background ${
                  activeId === s.id ? 'h-8 bg-accent/60' : 'h-1 bg-ink/15'
                }`}
              />
            ))}
          </nav>

          <div className="absolute bottom-8 left-12 md:left-24 z-20 pointer-events-none" aria-hidden="true">
            <p className="font-body text-[10px] tracking-[0.4em] text-ink/30 uppercase">
              {String(JAGUAR_SECTIONS.findIndex(s => s.id === activeId) + 1).padStart(2, '0')} /
              {String(JAGUAR_SECTIONS.length).padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
