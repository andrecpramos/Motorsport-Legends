import { useEffect, useState } from 'react'
import { PageMeta } from '../components/ui/PageMeta'
import { CarSchemaOrg } from '../components/ui/SchemaOrg'
import { useIsMobile } from '../hooks/useIsMobile'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { Porsche917kScene } from '../components/canvas/Porsche917kScene'
import { GenericSection } from '../components/sections/GenericSection'
import { StarSection } from '../components/sections/StarSection'
import { ProgressBar } from '../components/ui/ProgressBar'
import { BackButton } from '../components/ui/BackButton'
import { EnquiryModal } from '../components/ui/EnquiryModal'
import { ErrorBoundary } from '../components/ui/ErrorBoundary'
import { CarMobilePage } from '../components/ui/CarMobilePage'
import { CarNavbar } from '../components/layout/CarNavbar'
import { useActiveSection, scrollToSection } from '../hooks/useCarPage'
import { PORSCHE_917K_SECTIONS, PORSCHE_917K_TOTAL_SCROLL_HEIGHT } from '../constants/porsche917kSections'

// Porsche 917K accent: Le Mans amber
const PORSCHE_917K_ACCENT = '190 165 75'

const PORSCHE_917K_DRIVERS = [
  { name: 'Hans Herrmann',    role: '1970 Le Mans Winner'           },
  { name: 'Richard Attwood',  role: '1970 Le Mans Winner'           },
  { name: 'Jo Siffert',       role: 'Gulf Porsche — Works Driver'   },
  { name: 'Pedro Rodriguez',  role: 'Works Driver, 1970–71'         },
  { name: 'Brian Redman',     role: 'Co-Driver, Rodriguez'          },
  { name: 'Jacky Ickx',       role: 'Factory Driver, 1971'          },
  { name: 'Vic Elford',       role: 'Works Driver'                  },
  { name: 'Gérard Larrousse', role: '1971 Le Mans Winner'           },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Porsche917kPage() {
  const isMobile    = useIsMobile()
  const progressRef = useScrollProgress()
  const activeId    = useActiveSection(PORSCHE_917K_SECTIONS, progressRef)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (isMobile) return (
    <>
      <CarMobilePage
        brandLabel="Porsche"
        carName="917K"
        year="1970"
        origin="Zuffenhausen"
        sections={PORSCHE_917K_SECTIONS}
        owners={PORSCHE_917K_DRIVERS}
        starsTitle="THE DRIVERS"
        starsSubtitle="Those Who Raced It"
        starsCopy="The 917 was not driven — it was managed. Every driver who raced it described the experience in the same terms: exhilarating, demanding, and utterly unlike anything else."
        accentCss="190 165 75"
        bgCss="11 9 5"
        surfaceCss="18 14 7"
        onEnquire={() => setModalOpen(true)}
      />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} subject="Porsche 917K" />
    </>
  )

  return (
    <div style={{ '--color-accent': PORSCHE_917K_ACCENT, '--color-background': '11 9 5', '--color-surface': '18 14 7' } as React.CSSProperties}>
      <PageMeta
        title="Porsche 917K — Legends Classic Automobiles"
        description="580 horsepower. Twenty-five built for homologation. Two Le Mans victories. Explore the 1970 Porsche 917K in an immersive 3D showcase."
      />
      <CarSchemaOrg
        name="Porsche 917K"
        description="The dominant Le Mans racing car of 1970–71. 580 HP, air-cooled flat-12. Zuffenhausen."
        brand="Porsche"
        modelDate="1970"
        url="https://legends.cars/porsche917k"
      />
      <ProgressBar progressRef={progressRef} />
      <BackButton progressRef={progressRef} />
      <CarNavbar
        progressRef={progressRef}
        activeId={activeId}
        onEnquire={() => setModalOpen(true)}
        sections={PORSCHE_917K_SECTIONS}
        totalScrollHeight={PORSCHE_917K_TOTAL_SCROLL_HEIGHT}
        logoTitle="917K"
        logoSubtitle="Porsche"
        currentPath="/porsche917k"
      />
      <EnquiryModal open={modalOpen} onClose={() => setModalOpen(false)} subject="Porsche 917K" />

      <div id="scroll-container" style={{ height: PORSCHE_917K_TOTAL_SCROLL_HEIGHT }}>
        <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>

          <ErrorBoundary carName="Porsche 917K">
            <Porsche917kScene progressRef={progressRef} />
          </ErrorBoundary>

          {/* 917K amber racing glow */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 75% 55% at 50% 62%, rgba(190,155,50,0.16) 0%, transparent 65%)',
            }}
          />
          {/* Dark corner vignette */}
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(8,6,2,0.30) 100%)',
            }}
          />
          {/* Floor bleed — warm amber from below */}
          <div
            className="absolute inset-x-0 bottom-0 z-[1] pointer-events-none"
            style={{
              height: '35%',
              background: 'linear-gradient(to top, rgba(160,130,30,0.14) 0%, transparent 100%)',
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
            {PORSCHE_917K_SECTIONS.map((section, idx) => section.id === 'stars' ? (
              <StarSection
                key="stars"
                visible={activeId === 'stars'}
                title="THE DRIVERS"
                subtitle="Those Who Raced It"
                copy="The 917 was not driven — it was managed. Every driver who raced it described the experience in the same terms: exhilarating, demanding, and utterly unlike anything else."
                owners={PORSCHE_917K_DRIVERS}
              />
            ) : (
              <GenericSection
                key={section.id}
                section={section}
                visible={activeId === section.id}
                isFirst={idx === 0}
                progressRef={idx === 0 ? progressRef : undefined}
                storageKey={idx === 0 ? 'porsche917k-has-scrolled' : undefined}
                brandLabel={idx === 0 ? 'Porsche' : undefined}
                brandYear={idx === 0 ? 'Est. 1970' : undefined}
                onEnquire={() => setModalOpen(true)}
              />
            ))}
          </div>

          {/* Section indicators */}
          <nav
            aria-label="Section navigation"
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3"
          >
            {PORSCHE_917K_SECTIONS.map((s) => (
              <button
                key={s.id}
                aria-label={`Go to ${s.title} section`}
                aria-current={activeId === s.id ? 'true' : undefined}
                onClick={() => scrollToSection(PORSCHE_917K_TOTAL_SCROLL_HEIGHT, s.progressStart)}
                className={`w-px rounded-full transition-all duration-500 cursor-pointer hover:bg-accent/80 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background ${
                  activeId === s.id ? 'h-8 bg-accent/60' : 'h-1 bg-ink/15'
                }`}
              />
            ))}
          </nav>

          <div className="absolute bottom-8 left-12 md:left-24 z-20 pointer-events-none" aria-hidden="true">
            <p className="font-body text-[10px] tracking-[0.4em] text-ink/30 uppercase">
              {String(PORSCHE_917K_SECTIONS.findIndex(s => s.id === activeId) + 1).padStart(2, '0')} /
              {String(PORSCHE_917K_SECTIONS.length).padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
