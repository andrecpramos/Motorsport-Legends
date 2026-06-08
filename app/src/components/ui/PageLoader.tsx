/** Branded suspense fallback — shown while a lazy route's JS chunk loads. */
export function PageLoader() {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: '#080705',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 20,
      }}
    >
      <p style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontStyle: 'italic', fontWeight: 300,
        fontSize: '1.1rem', letterSpacing: '0.45em',
        color: 'rgba(220,215,205,0.28)',
      }}>
        Legends
      </p>
      <div style={{ position: 'relative', width: 80, height: 1, overflow: 'hidden', background: 'rgba(176,148,90,0.12)' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, transparent, rgba(176,148,90,0.65), transparent)',
          animation: 'legends-shimmer 1.4s ease-in-out infinite',
        }} />
      </div>
      <style>{`
        @keyframes legends-shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
