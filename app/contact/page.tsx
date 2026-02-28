import Link from "next/link"

export default function ContactPage() {
  return (
    <main className="bg-background min-h-screen flex flex-col justify-center px-8 md:px-[60px] py-32">
      <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-8 md:mb-10">
        Start a Project
      </p>
      <a
        href="mailto:hello@wearenotcreative.com"
        className="font-sans font-black text-[clamp(20px,4.5vw,72px)] text-foreground no-underline border-b-[3px] md:border-b-[5px] border-foreground w-fit leading-[1.1] hover:opacity-60 transition-opacity uppercase tracking-[-0.02em]"
      >
        HELLO@WEARENOTCREATIVE.COM
      </a>

      <p className="font-sans font-light text-[15px] md:text-[17px] text-muted-foreground mt-10 md:mt-16 max-w-[460px] leading-[1.65]">
        For new projects, collaborations, or conversations about what we
        might build together. Tell us about your brand, your challenge, 
        and your timeline.
      </p>

      {/* Inquiry structure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mt-16 md:mt-24 max-w-[900px]">
        <div>
          <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">
            New Projects
          </span>
          <p className="font-sans font-light text-[13px] md:text-[14px] text-foreground leading-[1.6]">
            Share your brief, budget range and timeline.
            We respond within 48 hours.
          </p>
        </div>
        <div>
          <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">
            Collaborations
          </span>
          <p className="font-sans font-light text-[13px] md:text-[14px] text-foreground leading-[1.6]">
            Open to editorial features, cultural projects
            and studio partnerships.
          </p>
        </div>
        <div>
          <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-3">
            General
          </span>
          <p className="font-sans font-light text-[13px] md:text-[14px] text-foreground leading-[1.6]">
            Press inquiries, speaking invitations, 
            or just to say hello.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-16 md:mt-24">
        <span className="font-sans font-light text-[12px] md:text-[13px] tracking-[0.2em] uppercase text-muted-foreground">
          Istanbul / Global
        </span>
        <span className="w-6 h-px bg-muted-foreground" />
        <a
          href="https://instagram.com/wearenotcreative"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans font-medium text-[12px] md:text-[13px] tracking-[0.15em] uppercase text-foreground no-underline border-b border-foreground hover:opacity-60 transition-opacity"
        >
          Instagram
        </a>
      </div>
    </main>
  )
}
