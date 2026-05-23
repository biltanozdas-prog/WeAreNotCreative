"use client"

import Link from "next/link"
import { motion } from "framer-motion"

interface ManifestoSectionProps {
  headline?: string
  body?: string
}

const FALLBACK_HEADLINE = "Design as a Cultural Practice."
const FALLBACK_BODY =
  "We work with independent brands, cultural institutions and creative leaders who need clarity without compromise. From identity systems to editorial direction — we shape how ideas become visible."

const STATEMENT =
  "An Istanbul-based creative studio building brands as cultural artifacts — not campaigns that disappear, but visual languages that carry meaning across time, medium, and market."

const SECTORS = [
  "Fashion",
  "Architecture",
  "Music",
  "Publishing",
  "Hospitality",
  "Art",
  "Technology",
  "Retail",
  "Culture",
]

export function ManifestoSection({ headline, body }: ManifestoSectionProps) {
  const displayHeadline = headline || FALLBACK_HEADLINE
  const displayBody = body || FALLBACK_BODY

  return (
    <section className="bg-background relative z-10 grid grid-cols-1 md:grid-cols-2 border-b border-foreground">
      {/* LEFT — existing manifesto (class set untouched) */}
      <div className="px-8 py-32 md:px-[60px] md:py-[180px] md:border-r border-foreground">
        <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-12 md:mb-20">
          Manifesto
        </p>
        <h1 className="font-sans font-black text-[8vw] md:text-[5.5vw] leading-[0.88] uppercase text-foreground max-w-[95%] text-balance tracking-[-0.03em]">
          {displayHeadline}
        </h1>
        <p className="font-sans font-light text-[16px] md:text-[20px] leading-[1.65] text-muted-foreground max-w-[560px] mt-14 md:mt-24 md:ml-[6ch]">
          {displayBody}
        </p>

        {/* CTA */}
        <div className="mt-14 md:mt-24 md:ml-[6ch]">
          <Link
            href="/contact"
            className="font-sans font-medium text-[13px] md:text-[14px] uppercase tracking-[0.15em] text-foreground no-underline border-b-2 border-foreground pb-1 hover:opacity-60 transition-opacity"
          >
            Start a Project
          </Link>
        </div>
      </div>

      {/* RIGHT — statement + sector tags, reveals on scroll */}
      <motion.div
        className="px-8 py-16 md:px-[60px] md:py-[180px] flex flex-col justify-between gap-12 md:gap-0"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[13px] md:text-[14px] leading-[1.7] text-foreground/60 border-l-[1.5px] border-foreground pl-5 max-w-[340px]">
          {STATEMENT}
        </p>

        <div>
          <p className="text-[8px] tracking-[.22em] uppercase text-foreground/30 mb-3">
            We work across
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SECTORS.map((tag) => (
              <span
                key={tag}
                className="text-[8px] tracking-[.1em] uppercase text-foreground/50 border border-foreground/20 px-2.5 py-1.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
