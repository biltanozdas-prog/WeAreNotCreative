"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef, useEffect, useState, useCallback } from "react"

const homeSizes = [
  { w: 480, mw: 320, h: "h-[55vh] md:h-[65vh]" },
  { w: 360, mw: 250, h: "h-[40vh] md:h-[50vh]" },
  { w: 540, mw: 380, h: "h-[60vh] md:h-[70vh]" },
  { w: 380, mw: 270, h: "h-[45vh] md:h-[55vh]" },
]

const homeOffsets = ["self-end", "self-start", "self-center", "self-end"]

export function SelectedProjects({ projects }: { projects: any[] }) {
  const selectedProjects = projects.slice(0, 4)

  return (
    <>
      {/* Desktop (md and above) */}
      <div className="hidden md:block">
        <DesktopSelectedProjects selectedProjects={selectedProjects} />
      </div>

      {/* Mobile (below md) */}
      <div className="block md:hidden">
        <MobileSelectedProjects selectedProjects={selectedProjects} />
      </div>
    </>
  )
}

function DesktopSelectedProjects({ selectedProjects }: { selectedProjects: any[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [trackWidth, setTrackWidth] = useState(0)
  const [sectionHeight, setSectionHeight] = useState(0)

  const measure = useCallback(() => {
    if (!trackRef.current || !sectionRef.current) return
    const tw = trackRef.current.scrollWidth
    const cw = sectionRef.current.offsetWidth
    setTrackWidth(tw)
    setSectionHeight(tw - cw + window.innerHeight)
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const scrolled = -rect.top
      const maxScroll = sectionHeight - window.innerHeight
      if (maxScroll <= 0) return
      const progress = Math.min(Math.max(scrolled / maxScroll, 0), 1)
      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sectionHeight])

  const translateX = scrollProgress * (trackWidth - (typeof window !== "undefined" ? window.innerWidth : 0))

  return (
    <section
      ref={sectionRef}
      className="relative bg-background md:h-[var(--section-height,200vh)]"
      style={{
        "--section-height": sectionHeight > 0 ? `${sectionHeight}px` : "200vh"
      } as React.CSSProperties}
    >
      <div className="md:sticky md:top-0 md:h-screen w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 px-8 md:px-[60px] pt-12 md:pt-16 mb-8 md:mb-12">
          <span className="font-sans font-light text-[13px] md:text-[14px] uppercase tracking-[0.2em] text-muted-foreground">
            Selected Work
          </span>
          <span className="w-6 h-px bg-muted-foreground" />
          <Link
            href="/projects"
            className="font-sans font-medium text-[13px] md:text-[14px] uppercase tracking-[0.05em] text-foreground no-underline border-b border-foreground hover:opacity-70 transition-opacity"
          >
            View All
          </Link>
        </div>

        {/* Horizontal track */}
        <div className="flex-1 overflow-hidden relative">
          <div
            ref={trackRef}
            className="flex flex-row items-end absolute top-0 left-0 h-full pl-[60px] pr-8 pb-4 gap-10 w-max"
            style={{ transform: `translateX(-${translateX}px)` }}
          >
            {selectedProjects.map((project, i) => {
              const size = homeSizes[i % homeSizes.length]
              const offset = homeOffsets[i % homeOffsets.length]

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className={`shrink-0 ${offset} flex flex-col no-underline text-foreground group`}
                  style={{ width: `clamp(${size.mw}px, 28vw, ${size.w}px)` }}
                >
                  <div className={`w-full ${size.h} bg-muted overflow-hidden relative`}>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
                      sizes="540px"
                      priority={i === 0}
                    />
                  </div>

                  <div className="flex justify-between items-baseline mt-4">
                    <h3 className="font-sans font-black text-[20px] uppercase leading-[0.9] tracking-[-0.02em]">
                      {project.title.replace("\n", " ")}
                    </h3>
                    <span className="font-sans font-light text-[12px] text-muted-foreground tracking-[0.15em] uppercase">
                      {project.role}
                    </span>
                  </div>
                </Link>
              )
            })}

            <div className="shrink-0 w-[120px]" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-[60px] mb-12 mt-8 h-[2px] bg-secondary relative">
          <div
            className="absolute top-0 left-0 h-full bg-foreground transition-[width] duration-75"
            style={{ width: `${Math.max(scrollProgress * 100, 3)}%` }}
          />
        </div>
      </div>
    </section>
  )
}

function MobileSelectedProjects({ selectedProjects }: { selectedProjects: any[] }) {
  const [scrollProgress, setScrollProgress] = useState(0)

  return (
    <section className="relative bg-background w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-8 pt-12 mb-8 relative z-10 bg-background">
        <span className="font-sans font-light text-[13px] uppercase tracking-[0.2em] text-muted-foreground">
          Selected Work
        </span>
        <span className="w-6 h-px bg-muted-foreground" />
        <Link
          href="/projects"
          className="font-sans font-medium text-[13px] uppercase tracking-[0.05em] text-foreground no-underline border-b border-foreground hover:opacity-70 transition-opacity"
        >
          View All
        </Link>
      </div>

      {/* Horizontal track (Native Scroll) */}
      <div
        className="w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent"
        style={{
          touchAction: "pan-x pan-y",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
        }}
        onScroll={(e) => {
          const target = e.currentTarget
          const maxScroll = target.scrollWidth - target.clientWidth
          if (maxScroll > 0) {
            setScrollProgress(target.scrollLeft / maxScroll)
          }
        }}
      >
        <div className="flex flex-row items-end h-full px-8 pb-4 gap-6 w-max">
          {selectedProjects.map((project, i) => {
            const size = homeSizes[i % homeSizes.length]
            const offset = homeOffsets[i % homeOffsets.length]

            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className={`snap-start shrink-0 flex-none ${offset} flex flex-col no-underline text-foreground`}
                style={{ width: `clamp(${size.mw}px, 60vw, ${size.w}px)` }}
              >
                <div className={`w-full ${size.h} bg-muted relative overflow-hidden`}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover grayscale"
                    sizes="380px"
                    priority={i === 0}
                  />
                </div>

                <div className="flex justify-between items-baseline mt-3">
                  <h3 className="font-sans font-black text-[16px] uppercase leading-[0.9] tracking-[-0.02em]">
                    {project.title.replace("\n", " ")}
                  </h3>
                  <span className="font-sans font-light text-[11px] text-muted-foreground tracking-[0.15em] uppercase">
                    {project.role}
                  </span>
                </div>
              </Link>
            )
          })}
          {/* Edge spacing for the last item */}
          <div className="shrink-0 flex-none w-[1px]" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-8 mb-8 mt-6 h-[2px] bg-secondary relative">
        <div
          className="absolute top-0 left-0 h-full bg-foreground transition-[width] duration-75"
          style={{ width: `${Math.max(scrollProgress * 100, 3)}%` }}
        />
      </div>
    </section>
  )
}
