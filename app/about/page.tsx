"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { team } from "@/lib/team"

export default function AboutPage() {
  const [expandedPerson, setExpandedPerson] = useState<number | null>(null)

  return (
    <main className="bg-background min-h-screen px-8 pt-[160px] pb-32 md:px-[60px] md:pt-[200px] md:pb-[180px]">
      <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6 md:mb-8">
        Who We Are
      </p>
      <h1 className="font-sans font-black text-[clamp(72px,14vw,200px)] leading-[0.82] tracking-[-0.04em] text-foreground uppercase mb-12 md:mb-16">
        ABOUT
      </h1>

      <p className="font-sans font-light text-[18px] md:text-[22px] leading-[1.55] text-foreground max-w-[800px] mb-16 md:mb-24">
        WEARENOTCREATIVE is a multidisciplinary studio operating at the
        intersection of fashion, design and visual culture. We develop cohesive
        systems, objects and narratives — bringing together creative direction,
        product thinking and cultural awareness into a unified practice.
      </p>

      {/* Positioning details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-28 md:mb-[160px] max-w-[1000px]">
        <div>
          <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-4">
            We Work With
          </span>
          <p className="font-sans font-light text-[14px] md:text-[15px] text-foreground leading-[1.6]">
            Independent fashion labels, cultural institutions, design-led
            startups, luxury houses, editorial publications, galleries and
            creative founders.
          </p>
        </div>
        <div>
          <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-4">
            Scale of Work
          </span>
          <p className="font-sans font-light text-[14px] md:text-[15px] text-foreground leading-[1.6]">
            From focused identity projects to full-scope creative direction
            across campaigns, products and spatial experiences. Local to
            international.
          </p>
        </div>
        <div>
          <span className="font-sans font-light text-[11px] md:text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-4">
            Philosophy
          </span>
          <p className="font-sans font-light text-[14px] md:text-[15px] text-foreground leading-[1.6]">
            Intentional over trendy. Structured over decorative. We believe
            design is a cultural act — not a service, but a practice.
          </p>
        </div>
      </div>

      {/* Team */}
      <div className="mb-8">
        <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
          The Team
        </p>
      </div>

      <div className="border-t-2 border-foreground mb-28 md:mb-[140px]">
        {team.map((person, index) => (
          <div
            key={person.name}
            className="border-b border-secondary py-10 md:py-14"
          >
            <button
              onClick={() =>
                setExpandedPerson(expandedPerson === index ? null : index)
              }
              className="w-full text-left bg-transparent border-none cursor-pointer p-0 group"
            >
              <div className="flex items-start justify-between gap-6">
                {/* Portrait */}
                <div className="relative w-[56px] h-[72px] md:w-[72px] md:h-[96px] shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover grayscale"
                    sizes="96px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <h3 className="font-sans font-black text-[20px] md:text-[26px] uppercase text-foreground tracking-[-0.02em]">
                        {person.name}
                      </h3>
                      <span className="font-sans font-light text-[12px] md:text-[13px] text-muted-foreground tracking-[0.15em] uppercase mt-2 block">
                        {person.title}
                      </span>
                    </div>
                    <span className="font-sans font-light text-[14px] text-muted-foreground shrink-0 transition-transform">
                      {expandedPerson === index ? "[ - ]" : "[ + ]"}
                    </span>
                  </div>
                  <p className="font-sans font-light text-[14px] md:text-[15px] text-foreground/70 max-w-[600px] mt-5 leading-[1.6]">
                    {person.shortBio}
                  </p>
                </div>
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${
                expandedPerson === index
                  ? "max-h-[1000px] opacity-100 mt-8"
                  : "max-h-0 opacity-0 mt-0"
              }`}
            >
              <div className="flex gap-6">
                {/* Spacer matching portrait width */}
                <div className="w-[56px] md:w-[72px] shrink-0" />
                <div className="font-sans font-light text-[14px] md:text-[15px] text-foreground/60 max-w-[600px] leading-[1.7] whitespace-pre-line">
                  {person.fullBio}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="border-t border-secondary pt-16 md:pt-24">
        <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6 md:mb-8">
          Collaborate
        </p>
        <h3 className="font-sans font-black text-[clamp(32px,6vw,80px)] leading-[0.88] uppercase text-foreground tracking-[-0.03em] mb-8 md:mb-12">
          WORK WITH US.
        </h3>
        <Link
          href="/contact"
          className="font-sans font-medium text-[13px] md:text-[14px] uppercase tracking-[0.15em] text-foreground no-underline border-b-2 border-foreground pb-1 hover:opacity-60 transition-opacity"
        >
          Start a Conversation
        </Link>
      </div>
    </main>
  )
}
