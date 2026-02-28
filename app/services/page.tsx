"use client"

import { useState } from "react"
import Link from "next/link"

const services = [
  {
    number: "01",
    label: "Brand Positioning",
    statement: "Defining where a brand stands and why it matters.",
    deliverables: [
      "Brand Strategy",
      "Market Positioning",
      "Naming & Verbal Identity",
      "Tone of Voice",
      "Brand Guidelines",
    ],
  },
  {
    number: "02",
    label: "Visual Systems",
    statement: "Building cohesive design languages that scale across every touchpoint.",
    deliverables: [
      "Visual Identity",
      "Design Systems",
      "Typography Systems",
      "Color Architecture",
      "Icon & Asset Libraries",
      "Print & Digital Templates",
    ],
  },
  {
    number: "03",
    label: "Art Direction",
    statement: "Shaping the visual narrative from concept to final frame.",
    deliverables: [
      "Creative Direction",
      "Campaign Concepts",
      "Fashion Direction",
      "Set Design Guidance",
      "Image Making",
    ],
  },
  {
    number: "04",
    label: "Identity Architecture",
    statement: "Structuring brand identities as living, interconnected systems.",
    deliverables: [
      "Brand Architecture",
      "Sub-brand Systems",
      "Packaging Design",
      "Environmental Identity",
      "Digital Identity",
      "Collateral Systems",
    ],
  },
  {
    number: "05",
    label: "Product Thinking",
    statement: "Designing physical and digital objects with intention and clarity.",
    deliverables: [
      "Product Design",
      "UX Strategy",
      "Prototyping",
      "Material Direction",
      "Object Design",
    ],
  },
]

const process = [
  {
    step: "01",
    title: "Research",
    text: "We listen before we design. Understanding context, audience and landscape.",
  },
  {
    step: "02",
    title: "Concept",
    text: "Translating research into strategic and creative frameworks.",
  },
  {
    step: "03",
    title: "System",
    text: "Building scalable design languages, not isolated deliverables.",
  },
  {
    step: "04",
    title: "Execution",
    text: "Precision in craft. Every detail serves the whole.",
  },
  {
    step: "05",
    title: "Deployment",
    text: "Delivering systems that work across contexts and evolve over time.",
  },
]

export default function ServicesPage() {
  const [expandedService, setExpandedService] = useState<number | null>(null)

  return (
    <main className="bg-background min-h-screen px-8 pt-[160px] pb-32 md:px-[60px] md:pt-[200px] md:pb-[180px]">
      {/* Header */}
      <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6 md:mb-8">
        What We Do
      </p>
      <h1 className="font-sans font-black text-[clamp(72px,14vw,200px)] leading-[0.82] tracking-[-0.04em] text-foreground uppercase mb-10 md:mb-14">
        SERVICES
      </h1>
      <p className="font-sans font-light text-[16px] md:text-[19px] text-muted-foreground leading-[1.6] max-w-[560px] mb-28 md:mb-[160px]">
        We operate across five core disciplines. Each project draws from
        multiple domains — structured around the specific needs of the brief,
        never templated.
      </p>

      {/* 5 Core Domains */}
      <div className="border-t-2 border-foreground mb-32 md:mb-[180px]">
        {services.map((service, index) => (
          <div
            key={service.number}
            className="border-b border-secondary"
          >
            <button
              onClick={() =>
                setExpandedService(expandedService === index ? null : index)
              }
              className="w-full text-left bg-transparent border-none cursor-pointer p-0 py-10 md:py-14 group"
            >
              <div className="flex items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 md:gap-6 shrink-0">
                  <span className="font-sans font-light text-[12px] md:text-[13px] tracking-[0.25em] text-muted-foreground uppercase">
                    {service.number}
                  </span>
                  <span className="hidden md:block w-8 h-px bg-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-sans font-black text-[28px] md:text-[42px] lg:text-[52px] uppercase leading-[0.88] tracking-[-0.03em] text-foreground group-hover:opacity-70 transition-opacity">
                    {service.label}
                  </h3>
                </div>
                <span className="font-sans font-light text-[14px] text-muted-foreground shrink-0 transition-transform">
                  {expandedService === index ? "[ - ]" : "[ + ]"}
                </span>
              </div>
            </button>

            {/* Expanded content */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${
                expandedService === index
                  ? "max-h-[600px] opacity-100 pb-10 md:pb-14"
                  : "max-h-0 opacity-0 pb-0"
              }`}
            >
              <div className="md:ml-[calc(13px+1.5rem+8px+2rem)] md:pl-0">
                <p className="font-sans font-light text-[15px] md:text-[17px] text-foreground/70 leading-[1.6] max-w-[500px] mb-8 md:mb-10">
                  {service.statement}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {service.deliverables.map((d) => (
                    <span
                      key={d}
                      className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.15em] text-muted-foreground"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Process / Method Section */}
      <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6 md:mb-8">
        How We Work
      </p>
      <h2 className="font-sans font-black text-[clamp(48px,10vw,140px)] leading-[0.82] tracking-[-0.04em] text-foreground uppercase mb-10 md:mb-14">
        METHOD
      </h2>
      <p className="font-sans font-light text-[15px] md:text-[17px] text-muted-foreground leading-[1.6] max-w-[480px] mb-20 md:mb-28">
        Every project follows the same philosophy, adapted to its own scale. 
        Not a formula. A way of thinking.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8 mb-32 md:mb-[160px]">
        {process.map((step) => (
          <div key={step.step}>
            <span className="font-sans font-light text-[12px] tracking-[0.25em] text-muted-foreground uppercase block mb-4">
              {step.step}
            </span>
            <h4 className="font-sans font-black text-[20px] md:text-[22px] uppercase text-foreground tracking-[-0.02em] mb-3">
              {step.title}
            </h4>
            <p className="font-sans font-light text-[13px] md:text-[14px] text-muted-foreground leading-[1.6]">
              {step.text}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="border-t border-secondary pt-16 md:pt-24">
        <p className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground mb-6 md:mb-8">
          Ready?
        </p>
        <h3 className="font-sans font-black text-[clamp(32px,6vw,80px)] leading-[0.88] uppercase text-foreground tracking-[-0.03em] mb-8 md:mb-12">
          {"LET'S BUILD\nSOMETHING."}
        </h3>
        <Link
          href="/contact"
          className="font-sans font-medium text-[13px] md:text-[14px] uppercase tracking-[0.15em] text-foreground no-underline border-b-2 border-foreground pb-1 hover:opacity-60 transition-opacity"
        >
          Start a Project
        </Link>
      </div>
    </main>
  )
}
