import { useState } from 'react'
import { Html } from '@react-three/drei'
import type { HotspotData } from '../../constants/hotspots'

// ─── Category colour tokens ───────────────────────────────────────────────────

const CATEGORY_COLOR: Record<HotspotData['category'], string> = {
  engineering: '176, 148, 90',   // gold — matches --color-accent
  design:      '160, 190, 220',  // cool silver
  interior:    '180, 155, 130',  // warm leather
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CarHotspotProps {
  hotspot: HotspotData
  visible: boolean
}

export function CarHotspot({ hotspot, visible }: CarHotspotProps) {
  const [hovered, setHovered] = useState(false)
  const c = CATEGORY_COLOR[hotspot.category]

  return (
    <Html
      position={hotspot.position}
      center
      zIndexRange={[50, 60]}
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
        userSelect: 'none',
      }}
    >
      {/* Wrapper — relative anchor for the tooltip */}
      <div style={{ position: 'relative' }}>

        {/* ── Pulse ring ── */}
        {visible && !hovered && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 20, height: 20,
              borderRadius: '50%',
              border: `1px solid rgba(${c}, 0.45)`,
              animation: 'hotspot-pulse 2s ease-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* ── Dot marker ── */}
        <button
          aria-label={`View details: ${hotspot.title}`}
          aria-expanded={hovered}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: hovered
              ? `rgba(${c}, 1)`
              : `rgba(${c}, 0.72)`,
            border: `1px solid rgba(${c}, ${hovered ? '1' : '0.50'})`,
            outline: 'none',
            cursor: 'pointer',
            transform: hovered ? 'scale(1.4)' : 'scale(1)',
            transition: 'all 0.25s ease',
            boxShadow: hovered
              ? `0 0 12px 3px rgba(${c}, 0.35), 0 0 0 4px rgba(${c}, 0.10), 0 0 0 3px rgba(${c}, 0.6)`
              : `0 0 6px 1px rgba(${c}, 0.20)`,
            display: 'block',
          }}
        />

        {/* ── Tooltip panel ── */}
        {hovered && (
          <div
            role="tooltip"
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 14px)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 240,
              background: 'rgba(12, 10, 8, 0.96)',
              border: `1px solid rgba(${c}, 0.30)`,
              backdropFilter: 'blur(12px)',
              padding: '14px 16px 16px',
              pointerEvents: 'none',
              animation: 'hotspot-fadein 0.2s ease',
            }}
          >
            {/* Category label */}
            <p style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              fontSize: '0.55rem',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: `rgba(${c}, 0.65)`,
              marginBottom: '0.4rem',
            }}>
              {hotspot.category}
            </p>

            {/* Title */}
            <p style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '0.95rem',
              color: 'rgba(220, 215, 205, 0.95)',
              lineHeight: 1.3,
              marginBottom: '0.6rem',
            }}>
              {hotspot.title}
            </p>

            {/* Divider */}
            <div style={{
              height: 1,
              background: `rgba(${c}, 0.18)`,
              marginBottom: '0.6rem',
            }} />

            {/* Detail */}
            <p style={{
              fontFamily: '"EB Garamond", Georgia, serif',
              fontStyle: 'italic',
              fontSize: '0.67rem',
              color: 'rgba(220, 215, 205, 0.50)',
              lineHeight: 1.75,
            }}>
              {hotspot.detail}
            </p>

            {/* Arrow */}
            <div style={{
              position: 'absolute',
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: 8,
              height: 8,
              background: 'rgba(12, 10, 8, 0.96)',
              border: `1px solid rgba(${c}, 0.30)`,
              borderTop: 'none',
              borderLeft: 'none',
            }} />
          </div>
        )}
      </div>

      {/* Keyframe animations injected once into the document head */}
      <style>{`
        @keyframes hotspot-pulse {
          0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.7; }
          70%  { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }
        @keyframes hotspot-fadein {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </Html>
  )
}
