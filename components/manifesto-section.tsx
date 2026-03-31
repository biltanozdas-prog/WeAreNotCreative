import Link from "next/link"

interface ManifestoSectionProps {
  headline?: string
  body?: string
}

export function ManifestoSection({ headline, body }: ManifestoSectionProps) {
  if (!headline && !body) return null

  return (
    <section className="bg-background relative z-10 px-8 py-32 md:px-[60px] md:py-[180px]">
      <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-12 md:mb-20">
        Manifesto
      </p>
      {headline && (
        <h1 className="font-sans font-black text-[8vw] md:text-[5.5vw] leading-[0.88] uppercase text-foreground max-w-[95%] text-balance tracking-[-0.03em]">
          {headline}
        </h1>
      )}
      {body && (
        <p className="font-sans font-light text-[16px] md:text-[20px] leading-[1.65] text-muted-foreground max-w-[560px] mt-14 md:mt-24 md:ml-[6ch]">
          {body}
        </p>
      )}

      {/* CTA */}
      <div className="mt-14 md:mt-24 md:ml-[6ch]">
        <Link
          href="/contact"
          className="font-sans font-medium text-[13px] md:text-[14px] uppercase tracking-[0.15em] text-foreground no-underline border-b-2 border-foreground pb-1 hover:opacity-60 transition-opacity"
        >
          Start a Project
        </Link>
      </div>
    </section>
  )
}
