"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const services = [
  { num: "01", name: "Brand Strategy", desc: "So your brand knows what it stands for." },
  { num: "02", name: "Visual Systems", desc: "So it looks the same everywhere it lives." },
  { num: "03", name: "Creative Direction", desc: "So every touchpoint carries conviction." },
  { num: "04", name: "Brand Architecture", desc: "So your portfolio makes sense." },
  { num: "05", name: "Digital Experiences", desc: "So the web works as hard as you do." },
  { num: "06", name: "Objects & Products", desc: "So the brand exists in your hands." },
  { num: "07", name: "Content & Campaign Systems", desc: "So the message keeps moving." },
]

export function WhatWeDoSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-8% 0px" })

  return (
    <section ref={ref} className="bg-background border-t border-foreground border-b border-foreground">
      {/* Header + Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-foreground/10">
        <motion.div
          className="px-8 md:px-[60px] py-8 md:border-r border-foreground/10"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-[clamp(13px,1.6vw,20px)] font-black tracking-[-0.02em] uppercase">
            What We Do
          </h2>
        </motion.div>

        <motion.div
          className="px-8 md:px-[60px] py-8"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <p className="text-[13px] md:text-[14px] font-black tracking-[-0.02em] uppercase leading-[1.2] text-foreground">
            We don&apos;t make things pretty.
          </p>
          <p className="text-[13px] md:text-[14px] font-black tracking-[-0.02em] uppercase leading-[1.2] text-foreground/40">
            We make things matter.
          </p>
        </motion.div>
      </div>

      {/* Service rows */}
      {services.map((svc, i) => (
        <motion.div
          key={svc.num}
          className="group relative overflow-hidden border-b border-foreground/[0.08] last:border-b-0"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.15 + i * 0.055,
          }}
        >
          {/* Sweep background */}
          <div className="absolute inset-0 bg-foreground -translate-x-full group-hover:translate-x-0 transition-transform duration-[300ms] ease-[cubic-bezier(0.77,0,0.18,1)]" />

          <div className="relative z-10 grid grid-cols-[40px_1fr_1fr] md:grid-cols-[60px_1fr_1fr] gap-0 items-baseline px-8 md:px-[60px] py-4 md:py-5">
            <span className="text-[9px] tracking-[.1em] text-foreground/25 group-hover:text-white/25 transition-colors duration-200">
              {svc.num}
            </span>
            <span className="text-[13px] md:text-[15px] font-black tracking-[-0.02em] uppercase text-foreground group-hover:text-white transition-colors duration-200">
              {svc.name}
            </span>
            <span className="text-[11px] text-foreground/40 group-hover:text-white/40 transition-colors duration-200 text-right hidden md:block">
              {svc.desc}
            </span>
          </div>
        </motion.div>
      ))}
    </section>
  )
}
