import { Link } from 'react-router-dom'
import { PageMeta } from '../components/ui/PageMeta'

export default function PrivacyPage() {
  return (
    <>
      <PageMeta
        title="Privacy Policy — Legends Classic Automobiles"
        description="Privacy policy for Legends Classic Automobiles. How we collect, use, and protect your personal data."
      />

      <div className="bg-background text-ink min-h-screen">
        {/* Header */}
        <div className="border-b border-ink/[0.06] px-8 md:px-16 py-5 flex items-center justify-between">
          <Link to="/" className="hover:opacity-70 transition-opacity duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/60">
            <p className="font-display font-light italic text-lg text-ink/90 tracking-wider leading-none">Legends</p>
            <p className="font-body text-[8px] tracking-[0.45em] text-accent/75 uppercase mt-0.5">Classic Automobiles</p>
          </Link>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 md:px-16 py-20">
          <p className="font-body text-[9px] tracking-[0.5em] text-accent/75 uppercase italic mb-4">Legal</p>
          <h1 className="font-display font-light italic text-4xl text-ink mb-2">Privacy Policy</h1>
          <p className="font-body text-[11px] text-ink/55 mb-12">Last updated: April 2026</p>

          <div className="space-y-10 font-body text-[13px] text-ink/80 leading-loose">

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">1. Who We Are</h2>
              <p>
                Legends Classic Automobiles ("we", "us", "our") is a private dealer specialising in museum-grade
                classic automobiles. We are committed to protecting your personal data and your right to privacy.
              </p>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">2. Data We Collect</h2>
              <p className="mb-3">When you submit an enquiry we collect:</p>
              <ul className="space-y-1.5 pl-4">
                <li>— Full name</li>
                <li>— Email address</li>
                <li>— Phone number (optional)</li>
                <li>— Your message</li>
                <li>— Timestamp and the vehicle you enquired about</li>
              </ul>
              <p className="mt-3">
                We also collect standard server logs (IP address, browser type, pages visited) for
                security and performance monitoring.
              </p>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">3. How We Use Your Data</h2>
              <ul className="space-y-1.5 pl-4">
                <li>— To respond to your enquiry about a vehicle</li>
                <li>— To arrange viewings and facilitate acquisition</li>
                <li>— To send you information about vehicles that may interest you (only with your consent)</li>
                <li>— To comply with our legal obligations</li>
              </ul>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">4. Legal Basis</h2>
              <p>
                We process your enquiry data on the basis of <em>legitimate interests</em> (responding to a
                business enquiry you initiated). If we contact you for marketing purposes we will obtain your
                explicit consent first.
              </p>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">5. Data Sharing</h2>
              <p>
                We do not sell your personal data. We may share it with:
              </p>
              <ul className="mt-3 space-y-1.5 pl-4">
                <li>— Our email provider (Resend) to deliver notifications</li>
                <li>— Our database provider (Supabase) to store enquiries</li>
                <li>— Analytics providers (anonymised, aggregated only)</li>
                <li>— Law enforcement when legally required</li>
              </ul>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">6. Cookies</h2>
              <p>
                We use a single first-party cookie to store your cookie consent preference. If you accept
                analytics cookies we use anonymised usage data to improve the site. You may withdraw consent
                at any time by clearing your browser's local storage.
              </p>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">7. Data Retention</h2>
              <p>
                Enquiry records are retained for 3 years unless you request deletion. Server logs are
                purged after 90 days.
              </p>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">8. Your Rights (GDPR / UK GDPR)</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="space-y-1.5 pl-4">
                <li>— Access the personal data we hold about you</li>
                <li>— Correct inaccurate data</li>
                <li>— Request deletion ("right to be forgotten")</li>
                <li>— Object to processing</li>
                <li>— Data portability</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email us at{' '}
                <a href="mailto:privacy@legends.cars" className="text-accent/70 hover:text-accent transition-colors duration-300">
                  privacy@legends.cars
                </a>.
                We will respond within 30 days.
              </p>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">9. Contact</h2>
              <p>
                For privacy matters:{' '}
                <a href="mailto:privacy@legends.cars" className="text-accent/70 hover:text-accent transition-colors duration-300">
                  privacy@legends.cars
                </a>
              </p>
            </section>

          </div>

          <div className="mt-16 pt-8 border-t border-ink/[0.06]">
            <Link
              to="/"
              className="font-body text-[10px] tracking-[0.35em] text-ink/65 uppercase hover:text-accent/80 transition-colors duration-300"
            >
              ← Back to Legends
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
