import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'signin' | 'register'

interface AuthModalProps {
  open:    boolean
  onClose: () => void
}

// ─── Shared input class ───────────────────────────────────────────────────────

const inputClass =
  'w-full bg-transparent border border-ink/15 px-3 py-2.5 font-body text-sm text-ink ' +
  'placeholder:text-ink/25 focus:outline-none focus:border-accent/50 transition-colors duration-300'

// ─── Sign In form ─────────────────────────────────────────────────────────────

function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const { signIn } = useAuth()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => emailRef.current?.focus(), 60)
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password) { setError('Email and password are required'); return }
    setError(null)
    setLoading(true)
    const { error: err } = await signIn(form.email.trim(), form.password)
    setLoading(false)
    if (err) { setError(err); return }
    onSuccess()
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="auth-email" className="font-body text-[10px] tracking-[0.3em] text-ink/85 uppercase block mb-1.5">
          Email
        </label>
        <input
          ref={emailRef}
          id="auth-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(null) }}
          className={inputClass}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="auth-password" className="font-body text-[10px] tracking-[0.3em] text-ink/85 uppercase block mb-1.5">
          Password
        </label>
        <input
          id="auth-password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(null) }}
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="font-body text-[10px] text-red-700/80 italic">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full px-6 py-3 border border-accent/55 font-body text-[11px] tracking-[0.35em] text-accent uppercase overflow-hidden transition-colors duration-400 hover:text-background disabled:opacity-50"
      >
        <span className="absolute inset-0 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]" />
        <span className="relative">{loading ? 'Signing in…' : 'Sign In'}</span>
      </button>
    </form>
  )
}

// ─── Register form ────────────────────────────────────────────────────────────

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { signUp } = useAuth()
  const [form, setForm]     = useState({ email: '', password: '', confirm: '' })
  const [error, setError]   = useState<string | null>(null)
  const [done, setDone]     = useState(false)
  const [loading, setLoading] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => emailRef.current?.focus(), 60)
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim()) { setError('Email is required'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Enter a valid email'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    setError(null)
    setLoading(true)
    const { error: err } = await signUp(form.email.trim(), form.password)
    setLoading(false)
    if (err) { setError(err); return }
    // Supabase sends a confirmation email — show a success state
    setDone(true)
    // If email confirmation is disabled in Supabase, user is auto-signed in → call onSuccess
    setTimeout(onSuccess, 2200)
  }

  if (done) {
    return (
      <motion.div
        className="text-center py-6 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-px h-8 bg-accent/40 mx-auto" />
        <p className="font-display font-light italic text-2xl text-ink">Account created</p>
        <p className="font-body text-[12px] italic text-ink/78 leading-loose">
          Check your email to confirm your address.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="reg-email" className="font-body text-[10px] tracking-[0.3em] text-ink/85 uppercase block mb-1.5">
          Email
        </label>
        <input
          ref={emailRef}
          id="reg-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(null) }}
          className={inputClass}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="reg-password" className="font-body text-[10px] tracking-[0.3em] text-ink/85 uppercase block mb-1.5">
          Password <span className="normal-case tracking-normal text-ink/55 text-[10px]">(min. 8 characters)</span>
        </label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError(null) }}
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      <div>
        <label htmlFor="reg-confirm" className="font-body text-[10px] tracking-[0.3em] text-ink/85 uppercase block mb-1.5">
          Confirm Password
        </label>
        <input
          id="reg-confirm"
          type="password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={e => { setForm(f => ({ ...f, confirm: e.target.value })); setError(null) }}
          className={inputClass}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="font-body text-[10px] text-red-700/80 italic">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group relative w-full px-6 py-3 border border-accent/55 font-body text-[11px] tracking-[0.35em] text-accent uppercase overflow-hidden transition-colors duration-400 hover:text-background disabled:opacity-50"
      >
        <span className="absolute inset-0 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]" />
        <span className="relative">{loading ? 'Creating account…' : 'Create Account'}</span>
      </button>
    </form>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('signin')
  const prevFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open) {
      prevFocus.current = document.activeElement as HTMLElement
    } else {
      setTab('signin')
      prevFocus.current?.focus()
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // If already logged in, show account panel
  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Account"
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-black/78 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

          <motion.div
            className="relative z-10 w-full max-w-md bg-[#141210] border border-accent/25 shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {user ? (
              // ── Logged-in state ──
              <div className="p-8 md:p-10">
                <p className="font-body text-[10px] tracking-[0.4em] text-accent uppercase italic mb-2">
                  Your Account
                </p>
                <h2 className="font-display font-light italic text-3xl text-ink leading-tight mb-8">
                  Welcome back
                </h2>
                <div
                  className="border border-ink/[0.08] p-4 mb-6"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <p className="font-body text-[10px] tracking-[0.3em] text-ink/65 uppercase mb-1">
                    Signed in as
                  </p>
                  <p className="font-body text-sm text-ink/80">{user.email}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSignOut}
                    className="flex-1 px-6 py-3 border border-ink/20 font-body text-[11px] tracking-[0.35em] text-ink/78 uppercase hover:border-ink/40 hover:text-ink transition-all duration-400"
                  >
                    Sign Out
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-ink/[0.08] font-body text-[11px] tracking-[0.35em] text-ink/65 uppercase hover:border-ink/20 hover:text-ink/85 transition-all duration-400"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              // ── Auth forms ──
              <div>
                {/* Tab switcher */}
                <div className="flex border-b border-ink/[0.08]">
                  {(['signin', 'register'] as Tab[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`flex-1 py-4 font-body text-[10px] tracking-[0.35em] uppercase transition-colors duration-300 ${
                        tab === t
                          ? 'text-accent border-b border-accent'
                          : 'text-ink/70 hover:text-ink'
                      }`}
                    >
                      {t === 'signin' ? 'Sign In' : 'Create Account'}
                    </button>
                  ))}
                </div>

                <div className="p-8 md:p-10">
                  <div className="mb-7">
                    <p className="font-body text-[10px] tracking-[0.4em] text-accent uppercase italic mb-2">
                      Private Access
                    </p>
                    <h2 className="font-display font-light italic text-3xl text-ink leading-tight">
                      {tab === 'signin' ? 'Sign In' : 'Create Account'}
                    </h2>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={tab}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      {tab === 'signin'
                        ? <SignInForm onSuccess={onClose} />
                        : <RegisterForm onSuccess={onClose} />
                      }
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-5 text-center">
                    <button
                      onClick={onClose}
                      className="font-body text-[9px] tracking-[0.3em] text-ink/65 uppercase hover:text-ink transition-colors duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
