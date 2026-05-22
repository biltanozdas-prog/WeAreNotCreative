"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

const services = [
  {
    num: "01",
    name: "Brand Strategy",
    desc: "The thinking before the making. We define positioning, audience, and the cultural context a brand lives in.",
  },
  {
    num: "02",
    name: "Visual Systems",
    desc: "Identities that scale. Logo systems, typography, color, and the rules that keep everything coherent.",
  },
  {
    num: "03",
    name: "Creative Direction",
    desc: "Art direction for campaigns, editorials, and brand moments that need a point of view — not just aesthetics.",
  },
  {
    num: "04",
    name: "Brand Architecture",
    desc: "How a brand family is structured. Parent brands, sub-brands, naming systems, and portfolio logic.",
  },
  {
    num: "05",
    name: "Digital Experiences",
    desc: "Websites and digital platforms built with the same rigor as physical identity. Design and development, together.",
  },
  {
    num: "06",
    name: "Objects & Products",
    desc: "When a brand needs to exist in three dimensions — packaging, print, spatial, and product design.",
  },
  {
    num: "07",
    name: "Content & Campaign Systems",
    desc: "The ongoing layer. Social systems, campaign frameworks, and the visual language of a brand in motion.",
  },
]

export function ServicesSection() {
  const [open, setOpen] = useState<number | null>(null)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-5% 0px" })

  return (
    <section
      ref={ref}
      className="bg-background border-t border-foreground border-b border-foreground"
    >
      {/* Header */}
      <motion.div
        className="flex justify-between items-end px-8 md:px-[60px] py-7 border-b border-foreground/10"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-[22px] md:text-[26px] font-black tracking-[-0.03em] uppercase">
          What We Do
        </h2>
        <p className="text-[9px] tracking-[.15em] uppercase text-muted-foreground">
          One Coherent Practice
        </p>
      </motion.div>

      {/* Service rows */}
      {services.map((svc, i) => {
        const isOpen = open === i
        return (
          <motion.div
            key={svc.num}
            className="border-b border-foreground/[0.08] last:border-b-0 overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1 + i * 0.05,
            }}
          >
            {/* Row header */}
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`group w-full grid grid-cols-[40px_1fr_24px] items-center px-8 md:px-[60px] py-4 md:py-[18px] text-left transition-colors duration-200 ${
                isOpen ? "bg-foreground" : "hover:bg-foreground"
              }`}
            >
              <span
                className={`text-[9px] tracking-[.1em] transition-colors duration-200 ${
                  isOpen
                    ? "text-white/30"
                    : "text-foreground/25 group-hover:text-white/30"
                }`}
              >
                {svc.num}
              </span>
              <span
                className={`text-[14px] md:text-[15px] font-black tracking-[-0.02em] uppercase transition-colors duration-200 ${
                  isOpen ? "text-white" : "text-foreground group-hover:text-white"
                }`}
              >
                {svc.name}
              </span>
              <span
                className={`inline-block text-[12px] transition-all duration-300 ${
                  isOpen
                    ? "text-white/40 rotate-90"
                    : "text-foreground/25 group-hover:text-white/40"
                }`}
              >
                →
              </span>
            </button>

            {/* Expand body */}
            <motion.div
              initial={false}
              animate={{ height: isOpen ? "auto" : 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              <p className="px-8 md:px-[60px] pb-5 pt-1 pl-[calc(2rem+40px)] md:pl-[calc(60px+40px)] text-[12px] leading-[1.7] text-muted-foreground max-w-[640px]">
                {svc.desc}
              </p>
            </motion.div>
          </motion.div>
        )
      })}
    </section>
  )
}
