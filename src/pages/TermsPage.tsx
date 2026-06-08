import { Link } from 'react-router-dom'
import { PageMeta } from '../components/ui/PageMeta'

export default function TermsPage() {
  return (
    <>
      <PageMeta
        title="Terms of Service — Legends Classic Automobiles"
        description="Terms and conditions for using the Legends Classic Automobiles website and enquiry service."
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
          <h1 className="font-display font-light italic text-4xl text-ink mb-2">Terms of Service</h1>
          <p className="font-body text-[11px] text-ink/55 mb-12">Last updated: April 2026</p>

          <div className="space-y-10 font-body text-[13px] text-ink/80 leading-loose">

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">1. Acceptance</h2>
              <p>
                By accessing this website you agree to these Terms of Service. If you do not agree,
                please do not use the site. We reserve the right to update these terms at any time;
                continued use constitutes acceptance.
              </p>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">2. No Binding Offers</h2>
              <p>
                All vehicle presentations on this site are for informational purposes only.
                Submitting an enquiry form does not constitute a binding offer, reservation, or contract
                of sale. A sale is only concluded upon execution of a written purchase agreement signed
                by both parties.
              </p>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">3. Accuracy of Information</h2>
              <p>
                We endeavour to ensure that all specifications, provenance records, and descriptions
                are accurate. However, we do not warrant that all information is complete or error-free.
                Prospective buyers are encouraged to conduct independent inspections and verify all
                details prior to purchase.
              </p>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">4. Vehicle Availability</h2>
              <p>
                Vehicles are offered subject to prior sale. We reserve the right to withdraw any
                vehicle from sale at any time without notice. Prices are available on application and
                may change without notice.
              </p>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">5. Intellectual Property</h2>
              <p>
                All content on this website — including 3D models, photographs, text, and design — is
                the property of Legends Classic Automobiles or its licensors. You may not reproduce,
                distribute, or create derivative works without our prior written consent.
              </p>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">6. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Legends Classic Automobiles shall not be liable
                for any indirect, incidental, or consequential damages arising from your use of this
                website or reliance on any information contained herein.
              </p>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">7. Governing Law</h2>
              <p>
                These terms are governed by the laws of England and Wales. Any disputes shall be subject
                to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <div className="h-px bg-ink/[0.06]" />

            <section>
              <h2 className="font-body text-[10px] tracking-[0.4em] text-ink/75 uppercase mb-4">8. Contact</h2>
              <p>
                For legal queries:{' '}
                <a href="mailto:legal@legends.cars" className="text-accent/70 hover:text-accent transition-colors duration-300">
                  legal@legends.cars
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
