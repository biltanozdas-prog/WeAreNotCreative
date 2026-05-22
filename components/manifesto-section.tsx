"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface ManifestoSectionProps {
  headline?: string
  body?: string
}

const FALLBACK_HEADLINE = "Design as a Cultural Practice."
const FALLBACK_BODY =
  "We work with independent brands, cultural institutions and creative leaders who need clarity without compromise. From identity systems to editorial direction — we shape how ideas become visible."

const RIGHT_BODY =
  "A multidisciplinary studio that builds visual languages — not decorations. We think in systems, move in culture, and deliver with precision."

export function ManifestoSection({ headline, body }: ManifestoSectionProps) {
  const displayHeadline = headline || FALLBACK_HEADLINE
  const displayBody = body || FALLBACK_BODY

  const rightRef = useRef<HTMLDivElement>(null)
  const rightInView = useInView(rightRef, { once: true, margin: "-10% 0px" })

  return (
    <section className="bg-background relative z-10 grid grid-cols-1 md:grid-cols-2 px-8 py-32 md:px-[60px] md:py-[180px] gap-0">
      {/* LEFT — existing manifesto (untouched class set) */}
      <div className="md:pr-16">
        <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-12 md:mb-20">
          Manifesto
        </p>
        <h1 className="font-sans font-black text-[8vw] md:text-[5.5vw] leading-[0.88] uppercase text-foreground max-w-[95%] text-balance tracking-[-0.03em]">
          {displayHeadline}
        </h1>
        <p className="font-sans font-light text-[16px] md:text-[20px] leading-[1.65] text-muted-foreground max-w-[560px] mt-14 md:mt-24 md:ml-[6ch]">
          {displayBody}
        </p>

        <div className="mt-14 md:mt-24 md:ml-[6ch]">
          <Link
            href="/contact"
            className="font-sans font-medium text-[13px] md:text-[14px] uppercase tracking-[0.15em] text-foreground no-underline border-b-2 border-foreground pb-1 hover:opacity-60 transition-opacity"
          >
            Start a Project
          </Link>
        </div>
      </div>

      {/* RIGHT — counter + supporting line, reveals on scroll */}
      <motion.div
        ref={rightRef}
        className="md:pl-16 md:border-l border-foreground/10 flex flex-col justify-between pt-16 md:pt-0"
        initial={{ opacity: 0, y: 32 }}
        animate={rightInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <p className="text-[80px] md:text-[96px] xl:text-[120px] font-black leading-[.85] tracking-[-0.06em] text-foreground">
            30+
          </p>
          <p className="text-[9px] tracking-[.2em] uppercase text-muted-foreground mt-2">
            Projects Delivered
          </p>
        </div>
        <p className="text-[12px] leading-[1.75] text-muted-foreground max-w-[280px] mt-12 md:mt-auto md:pt-0">
          {RIGHT_BODY}
        </p>
      </motion.div>
    </section>
  )
}
