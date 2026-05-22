"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

const services = [
  { num: "01", name: "Brand Strategy" },
  { num: "02", name: "Visual Systems" },
  { num: "03", name: "Creative Direction" },
  { num: "04", name: "Brand Architecture" },
  { num: "05", name: "Digital Experiences" },
  { num: "06", name: "Objects & Products" },
  { num: "07", name: "Content & Campaign Systems" },
]

export function ServicesSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-5% 0px" })

  return (
    <section
      ref={ref}
      className="bg-background border-t border-foreground border-b border-foreground"
    >
      {/* Header */}
      <motion.div
        className="flex justify-between items-end px-8 md:px-[60px] py-6 border-b border-foreground/10"
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-[clamp(14px,1.8vw,22px)] font-black tracking-[-0.025em] uppercase">
          What We Do
        </h2>
        <p className="text-[9px] tracking-[.15em] uppercase text-muted-foreground">
          One Coherent Practice
        </p>
      </motion.div>

      {/* Rows */}
      {services.map((svc, i) => (
        <motion.div
          key={svc.num}
          className="group relative overflow-hidden border-b border-foreground/[0.08] last:border-b-0 cursor-default"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.08 + i * 0.05,
          }}
        >
          {/* Sweep background */}
          <div className="absolute inset-0 bg-foreground translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-[320ms] ease-[cubic-bezier(0.77,0,0.18,1)]" />

          {/* Content */}
          <div className="relative z-10 flex items-center gap-0 px-8 md:px-[60px] py-4 md:py-[18px]">
            <span className="text-[9px] tracking-[.1em] text-foreground/25 group-hover:text-white/30 transition-colors duration-200 w-10 flex-shrink-0">
              {svc.num}
            </span>
            <span className="text-[14px] md:text-[16px] font-black tracking-[-0.025em] uppercase text-foreground group-hover:text-white transition-colors duration-200">
              {svc.name}
            </span>
          </div>
        </motion.div>
      ))}
    </section>
  )
}
