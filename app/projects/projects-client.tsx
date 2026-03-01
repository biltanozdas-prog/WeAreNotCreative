"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef, useEffect, useState, useCallback } from "react"

const sizePatterns = [
  { w: 520, mw: 340, h: "h-[70vh]" },
  { w: 380, mw: 280, h: "h-[50vh]" },
  { w: 600, mw: 400, h: "h-[75vh]" },
  { w: 340, mw: 260, h: "h-[55vh]" },
  { w: 500, mw: 360, h: "h-[65vh]" },
  { w: 420, mw: 300, h: "h-[58vh]" },
]

const offsetPatterns = [
  "self-end",
  "self-start",
  "self-center",
  "self-end",
  "self-start",
  "self-center",
]

export function ProjectsClient({ projects }: { projects: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [trackWidth, setTrackWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  const measure = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return
    const tw = trackRef.current.scrollWidth
    const cw = containerRef.current.offsetWidth
    setTrackWidth(tw)
    // The total scrollable height = track overflow + one viewport
    setContainerHeight(tw - cw + window.innerHeight)
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scrolled = -rect.top
      const maxScroll = containerHeight - window.innerHeight
      if (maxScroll <= 0) return
      const progress = Math.min(Math.max(scrolled / maxScroll, 0), 1)
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [containerHeight])

  const translateX = scrollProgress * (trackWidth - (typeof window !== "undefined" ? window.innerWidth : 0))

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: containerHeight > 0 ? `${containerHeight}px` : "300vh" }}
    >
      <div className="sticky top-0 h-screen w-screen overflow-hidden flex flex-col">
        {/* Header area */}
        <div className="pl-8 md:pl-[60px] pt-[140px] md:pt-[160px] mb-6 md:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-muted-foreground">
              Selected Work
            </span>
            <span className="w-6 h-px bg-muted-foreground" />
            <span className="font-sans font-medium text-[12px] md:text-[13px] uppercase tracking-[0.05em] text-foreground">
              {String(projects.length).padStart(2, "0")} Projects
            </span>
          </div>
          <p className="font-sans font-light text-[14px] md:text-[15px] text-muted-foreground max-w-[440px] leading-[1.6]">
            A curated selection across disciplines. Each project is shaped
            by its own context, scale and ambition.
          </p>
        </div>

        {/* Horizontal scrolling track */}
        <div className="flex-1 overflow-hidden relative">
          <div
            ref={trackRef}
            className="flex flex-row items-end absolute top-0 left-0 h-full pl-8 md:pl-[60px] pb-8 gap-6 md:gap-10"
            style={{ transform: `translateX(-${translateX}px)` }}
          >
            {projects.map((project, i) => {
              const size = sizePatterns[i % sizePatterns.length]
              const offset = offsetPatterns[i % offsetPatterns.length]

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className={`shrink-0 ${offset} flex flex-col no-underline text-foreground group`}
                  style={{ width: `clamp(${size.mw}px, 30vw, ${size.w}px)` }}
                >
                  <div className={`w-full ${size.h} bg-muted overflow-hidden relative`}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 400px, 600px"
                      priority={i === 0}
                    />
                  </div>

                  <div className="flex justify-between items-baseline mt-4 md:mt-5">
                    <div>
                      <h3 className="font-sans font-black text-[18px] md:text-[22px] uppercase leading-[0.9] tracking-[-0.02em]">
                        {project.title.replace("\n", " ")}
                      </h3>
                      <span className="font-sans font-light text-[11px] md:text-[12px] text-muted-foreground tracking-[0.15em] uppercase mt-2 block">
                        {project.client} / {project.year}
                      </span>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="font-sans font-light text-[11px] md:text-[12px] text-muted-foreground tracking-[0.15em] uppercase block">
                        {project.category}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}

            <div className="shrink-0 w-[120px]" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-8 md:mx-[60px] mb-8 md:mb-12 mt-4 h-[2px] bg-secondary relative">
          <div
            className="absolute top-0 left-0 h-full bg-foreground transition-[width] duration-75"
            style={{ width: `${Math.max(scrollProgress * 100, 3)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
