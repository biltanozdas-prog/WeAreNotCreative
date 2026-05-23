"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface RevealSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left"
}

export function RevealSection({
  children,
  className,
  delay = 0,
  direction = "up",
}: RevealSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: direction === "up" ? 28 : 0,
        x: direction === "left" ? -20 : 0,
      }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
