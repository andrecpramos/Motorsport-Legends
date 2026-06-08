import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../components/ui/PageMeta'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lead {
  id:         string
  created_at: string
  car:        string
  name:       string
  email:      string
  phone:      string | null
  message:    string | null
}

// ─── Auth gate ────────────────────────────────────────────────────────────────

const SESSION_KEY = 'legends-admin-session'

function AuthGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(false)
  const [loading, setLoading]   = useState(false)

  const attempt = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin-auth', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      })
      if (res.ok) {
        const { token } = await res.json() as { token: string }
        sessionStorage.setItem(SESSION_KEY, token)
        onAuth()
      } else {
        setError(true)
        setPassword('')
      }
    } catch {
      setError(true)
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background text-ink min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xs px-8">
        <p className="font-body text-[9px] tracking-[0.5em] text-accent/55 uppercase italic mb-2 text-center">
          Private Access
        </p>
        <h1 className="font-display font-light italic text-3xl text-ink mb-8 text-center">
          Admin
        </h1>

        <form onSubmit={attempt} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="sr-only">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              placeholder="Password"
              aria-describedby={error ? 'admin-password-err' : undefined}
              aria-invalid={error}
              className={
                'w-full bg-transparent border px-4 py-3 font-body text-sm text-ink ' +
                'placeholder:text-ink/25 focus:outline-none transition-colors duration-300 ' +
                (error ? 'border-red-800/60' : 'border-ink/15 focus:border-accent/70')
              }
              autoFocus
            />
            {error && (
              <p id="admin-password-err" role="alert" className="font-body text-[9px] text-red-700/70 mt-1">
                Incorrect password
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 border border-accent/40 font-body text-[10px] tracking-[0.35em] text-accent uppercase hover:bg-accent/10 transition-colors duration-300 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {loading ? 'Verifying…' : 'Enter'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/" className="font-body text-[9px] tracking-[0.3em] text-ink/80 uppercase hover:text-accent transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Lead table ───────────────────────────────────────────────────────────────

function LeadTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-body text-[12px] italic text-ink/65">No enquiries yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full font-body text-[11px]">
        <thead>
          <tr className="border-b border-ink/[0.08]">
            {['Date', 'Car', 'Name', 'Email', 'Phone', 'Message'].map(h => (
              <th key={h} className="text-left py-3 pr-6 font-body text-[9px] tracking-[0.35em] text-ink/65 uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => (
            <tr key={lead.id} className="border-b border-ink/[0.05] hover:bg-ink/[0.02] transition-colors">
              <td className="py-4 pr-6 text-ink/70 whitespace-nowrap">
                {new Date(lead.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </td>
              <td className="py-4 pr-6 text-accent/70">{lead.car}</td>
              <td className="py-4 pr-6 text-ink/70">{lead.name}</td>
              <td className="py-4 pr-6">
                <a href={`mailto:${lead.email}`} className="text-ink/80 hover:text-accent transition-colors">
                  {lead.email}
                </a>
              </td>
              <td className="py-4 pr-6 text-ink/70">{lead.phone ?? '—'}</td>
              <td className="py-4 pr-6 text-ink/70 max-w-[220px] truncate">{lead.message ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const [leads, setLeads]     = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [filter, setFilter]   = useState<string>('all')

  useEffect(() => {
    const adminToken = sessionStorage.getItem(SESSION_KEY)
    fetch('/api/leads', {
      headers: adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {},
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then((data: Lead[]) => { setLeads(data); setLoading(false) })
      .catch(err => { setError(String(err)); setLoading(false) })
  }, [])

  const cars = ['all', ...Array.from(new Set(leads.map(l => l.car)))]
  const filtered = filter === 'all' ? leads : leads.filter(l => l.car === filter)

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    window.location.reload()
  }

  return (
    <div className="bg-background text-ink min-h-screen">
      {/* Header */}
      <div className="border-b border-ink/[0.06] px-8 md:px-16 py-5 flex items-center justify-between">
        <div>
          <p className="font-display font-light italic text-lg text-ink/90 tracking-wider leading-none">Legends</p>
          <p className="font-body text-[8px] tracking-[0.45em] text-accent/75 uppercase mt-0.5">Lead Dashboard</p>
        </div>
        <button
          onClick={logout}
          className="font-body text-[9px] tracking-[0.35em] text-ink/65 uppercase hover:text-ink transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50"
        >
          Sign Out
        </button>
      </div>

      <div className="px-8 md:px-16 py-12">
        {/* Stats row */}
        <div className="flex gap-8 mb-12 flex-wrap">
          {[
            { label: 'Total Enquiries', value: leads.length },
            { label: 'This Month', value: leads.filter(l => new Date(l.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length },
            { label: 'Mercedes', value: leads.filter(l => l.car.toLowerCase().includes('mercedes') || l.car.toLowerCase().includes('300')).length },
            { label: 'Ferrari', value: leads.filter(l => l.car.toLowerCase().includes('ferrari')).length },
            { label: 'Jaguar', value: leads.filter(l => l.car.toLowerCase().includes('jaguar') || l.car.toLowerCase().includes('e-type')).length },
            { label: 'McLaren', value: leads.filter(l => l.car.toLowerCase().includes('mclaren') || l.car.toLowerCase().includes('f1')).length },
            { label: 'Porsche', value: leads.filter(l => l.car.toLowerCase().includes('porsche') || l.car.toLowerCase().includes('911') || l.car.toLowerCase().includes('917')).length },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-body text-[9px] tracking-[0.35em] text-ink/65 uppercase mb-1">{label}</p>
              <p className="font-display font-light italic text-3xl text-ink">{value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div role="group" aria-label="Filter by car" className="flex gap-3 mb-8 flex-wrap">
          {cars.map(car => (
            <button
              key={car}
              onClick={() => setFilter(car)}
              aria-pressed={filter === car}
              className={`font-body text-[9px] tracking-[0.3em] uppercase px-4 py-2 border transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 ${
                filter === car
                  ? 'border-accent/50 text-accent'
                  : 'border-ink/20 text-ink/65 hover:border-ink/40'
              }`}
            >
              {car === 'all' ? 'All Cars' : car}
            </button>
          ))}
        </div>

        <div aria-live="polite" aria-atomic="true">
          {loading && (
            <div className="text-center py-20">
              <div className="w-10 h-px bg-accent/30 mx-auto animate-pulse" />
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="font-body text-[12px] text-red-700/60">Error loading leads: {error}</p>
              <p className="font-body text-[11px] text-ink/65 mt-2 italic">
                Session may have expired — please sign in again.
              </p>
            </div>
          )}
        </div>

        {!loading && !error && (
          <>
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {filtered.length === 0
                ? 'No enquiries found'
                : `Showing ${filtered.length} enquir${filtered.length === 1 ? 'y' : 'ies'}${filter !== 'all' ? ` for ${filter}` : ''}`}
            </p>
            <LeadTable leads={filtered} />
          </>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem(SESSION_KEY))

  return (
    <>
      <PageMeta title="Admin — Legends Classic Automobiles" />
      {authed ? <Dashboard /> : <AuthGate onAuth={() => setAuthed(true)} />}
    </>
  )
}
