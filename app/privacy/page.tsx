import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — WeAreNotCreative",
}

export default function PrivacyPage() {
  return (
    <main className="bg-background text-foreground min-h-screen pt-[88px] md:pt-[140px] pb-[120px]">
      <div className="px-5 md:px-[60px] max-w-[680px]">
        <p className="text-[9px] tracking-[.2em] uppercase text-muted-foreground mb-8">
          Legal
        </p>
        <h1 className="text-[clamp(32px,5vw,56px)] font-black leading-[.95] tracking-[-0.04em] uppercase mb-12">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-[14px] leading-[1.8] text-muted-foreground">
          <section>
            <h2 className="text-[11px] tracking-[.15em] uppercase text-foreground font-bold mb-3">
              Who We Are
            </h2>
            <p>
              WeAreNotCreative is a multidisciplinary creative studio based in Istanbul, Turkey.
              Our website is wearenotcreativestudio.com.
            </p>
          </section>

          <section>
            <h2 className="text-[11px] tracking-[.15em] uppercase text-foreground font-bold mb-3">
              What Data We Collect
            </h2>
            <p>
              This website does not use tracking cookies or collect personal data through forms.
              We do not use Google Analytics or any third-party tracking services.
              If you contact us via email, your email address and message content are used solely
              to respond to your inquiry and are not shared with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-[11px] tracking-[.15em] uppercase text-foreground font-bold mb-3">
              Hosting
            </h2>
            <p>
              This site is hosted on Vercel. Vercel may collect basic server logs
              (IP addresses, request timestamps) as part of standard infrastructure operation.
              See Vercel&apos;s privacy policy at vercel.com/legal/privacy-policy.
            </p>
          </section>

          <section>
            <h2 className="text-[11px] tracking-[.15em] uppercase text-foreground font-bold mb-3">
              Contact
            </h2>
            <p>
              For any privacy-related questions, contact us at the email address listed
              on our contact page.
            </p>
          </section>

          <section>
            <p className="text-[12px] text-foreground/40">
              Last updated: May 2026
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
