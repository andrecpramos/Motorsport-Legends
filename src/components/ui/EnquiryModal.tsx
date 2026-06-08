import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EnquiryModalProps {
  open:     boolean
  onClose:  () => void
  subject?: string   // e.g. "Ferrari 250 GTO" — used in aria-label
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function EnquiryModal({ open, onClose, subject }: EnquiryModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      previousFocusRef.current = document.activeElement as HTMLElement
      setTimeout(() => firstFieldRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
      setSubmitted(false)
      setForm({ name: '', email: '', phone: '', message: '' })
      setErrors({})
      previousFocusRef.current?.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (!focusable.length) return
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus() }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus() }
    }
  }, [onClose])

  useEffect(() => {
    window.addEventListener('keydown', trapFocus)
    return () => window.removeEventListener('keydown', trapFocus)
  }, [trapFocus])

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Partial<typeof form> = {}
    if (!form.name.trim())  newErrors.name  = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Valid email required'
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }
    setErrors({})
    setSubmitError(false)
    setSubmitting(true)
    try {
      const res = await fetch('/api/enquire', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...form, car: subject ?? 'Unknown' }),
      })
      if (!res.ok) throw new Error('server error')
      setSubmitted(true)
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full bg-transparent border border-ink/25 px-3 py-2.5 font-body text-sm text-ink ' +
    'placeholder:text-ink/38 focus:outline-none focus:border-accent/60 transition-colors duration-300'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Enquire${subject ? ` about the ${subject}` : ''}`}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-black/78 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

          <motion.div
            ref={dialogRef}
            className="relative z-10 w-full max-w-md bg-[#141210] border border-accent/25 p-6 md:p-10 shadow-2xl max-h-[90svh] overflow-y-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {!submitted ? (
              <>
                <div className="mb-7">
                  <p className="font-body text-[10px] tracking-[0.4em] text-accent uppercase italic mb-2">
                    Private Acquisition
                  </p>
                  <h2 className="font-display font-light italic text-3xl text-ink leading-tight">
                    Enquire
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label
                      htmlFor="enq-name"
                      className="font-body text-[10px] tracking-[0.3em] text-ink/85 uppercase block mb-1.5"
                    >
                      Full Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="enq-name"
                      type="text"
                      required
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'enq-name-err' : undefined}
                      value={form.name}
                      onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: undefined })) }}
                      className={inputClass + (errors.name ? ' border-red-800/60' : '')}
                      placeholder="Your name"
                    />
                    {errors.name && <p id="enq-name-err" role="alert" className="font-body text-[9px] text-red-700/80 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="enq-email"
                      className="font-body text-[10px] tracking-[0.3em] text-ink/85 uppercase block mb-1.5"
                    >
                      Email <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="enq-email"
                      type="email"
                      required
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'enq-email-err' : undefined}
                      value={form.email}
                      onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: undefined })) }}
                      className={inputClass + (errors.email ? ' border-red-800/60' : '')}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p id="enq-email-err" role="alert" className="font-body text-[9px] text-red-700/80 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="enq-phone"
                      className="font-body text-[10px] tracking-[0.3em] text-ink/85 uppercase block mb-1.5"
                    >
                      Phone{' '}
                      <span className="normal-case tracking-normal text-ink/55 text-[10px]">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="enq-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className={inputClass}
                      placeholder="+1 000 000 0000"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="enq-message"
                      className="font-body text-[10px] tracking-[0.3em] text-ink/85 uppercase block mb-1.5"
                    >
                      Message
                    </label>
                    <textarea
                      id="enq-message"
                      rows={4}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className={inputClass + ' resize-none'}
                      placeholder="Please tell us about your interest…"
                    />
                  </div>

                  {submitError && (
                    <p className="font-body text-[10px] text-red-700/80 italic pt-1">
                      Something went wrong — please try again or contact us directly.
                    </p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative flex-1 px-6 py-3 border border-accent/55 font-body text-[11px] tracking-[0.35em] text-accent uppercase overflow-hidden transition-colors duration-400 hover:text-background disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="absolute inset-0 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                      <span className="relative">{submitting ? 'Sending…' : 'Submit'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close enquiry form"
                      className="px-6 py-3 border border-ink/25 font-body text-[11px] tracking-[0.35em] text-ink/78 uppercase hover:border-ink/45 hover:text-ink transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141210]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <motion.div
                className="text-center py-8 space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-px h-10 bg-accent/40 mx-auto" />
                <h2 className="font-display font-light italic text-3xl text-ink">Thank you</h2>
                <p className="font-body text-[13px] italic text-ink/70 leading-loose max-w-[260px] mx-auto">
                  Your enquiry has been received. We will be in touch at our earliest convenience.
                </p>
                <p className="font-body text-[10px] tracking-[0.3em] text-ink/70 uppercase">
                  By appointment only
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-8 py-3 border border-ink/28 font-body text-[11px] tracking-[0.35em] text-ink/80 uppercase hover:border-accent/50 hover:text-accent transition-all duration-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141210]"
                >
                  Close
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
