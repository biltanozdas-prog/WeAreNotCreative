"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useMemo, useRef, useEffect } from "react"

export function ProjectsClient({
  projects,
  pageData,
  serviceCategories = [],
}: {
  projects: any[]
  pageData?: any
  serviceCategories?: string[]
}) {
  const [activePreviewImageSrc, setActivePreviewImageSrc] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string>("All")
  const [panelOpen, setPanelOpen] = useState(false)

  const filteredProjects = useMemo(() => {
    if (selectedService === "All") return projects
    return projects.filter(
      (p) => Array.isArray(p.services) && p.services.includes(selectedService)
    )
  }, [selectedService, projects])

  const handleSelect = (value: string) => {
    setSelectedService(value)
    setPanelOpen(false)
  }

  // Heading text: "ALL PROJECTS" or "ALL PROJECTS — ART DIRECTION"
  const headingText =
    selectedService === "All"
      ? "All Projects"
      : `All Projects — ${selectedService}`

  return (
    <div className="relative w-full min-h-screen">

      {/* ── Layer 0: Fixed background images ─────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none bg-white overflow-hidden z-0"
        style={{ width: "100%", height: "100%" }}
      >
        {projects.map((project) => {
          const imageSrc = project.featuredImage || project.heroImage || project.image
          if (!imageSrc) return null
          return (
            <Image
              key={`bg-${project.id}`}
              src={imageSrc}
              alt={project.title}
              fill
              className={`object-cover transition-opacity duration-500 ease-in-out ${
                activePreviewImageSrc === imageSrc ? "opacity-100" : "opacity-0"
              }`}
            />
          )
        })}
      </div>

      {/* ── Layer 1: Non-blended header + filter section ──────────
           Solid white background — no mix-blend-difference here so
           the dropdown panel and tags render with proper colours. */}
      <div className="relative z-10 w-full pt-[140px] md:pt-[160px] bg-white">

        {/* Page header */}
        <div className="px-4 md:px-[60px] mb-10 md:mb-16">
          <div className="flex items-center gap-4 mb-6">
            {pageData?.eyebrowLabel && (
              <span className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em] text-foreground">
                {pageData.eyebrowLabel}
              </span>
            )}
            <span className="w-6 h-px bg-foreground" />
            <span className="font-sans font-medium text-[12px] md:text-[13px] uppercase tracking-[0.05em] text-foreground">
              {String(projects.length).padStart(2, "0")} Projects
            </span>
          </div>
          {pageData?.intro && (
            <p className="font-sans font-light text-[14px] md:text-[15px] max-w-[440px] leading-[1.6] text-foreground">
              {pageData.intro}
            </p>
          )}
        </div>

        {/* Filter trigger */}
        <div className="px-4 md:px-[60px] mb-0">
          <button
            onClick={() => setPanelOpen((v) => !v)}
            className="flex items-center gap-3 group"
            aria-expanded={panelOpen}
          >
            <span className="font-['Montserrat'] font-black text-[clamp(28px,5vw,56px)] leading-none uppercase tracking-[-0.02em] text-foreground">
              {headingText}
            </span>
            <span
              className="opacity-40 group-hover:opacity-80 transition-all duration-200"
              style={{
                display: "inline-block",
                transform: panelOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease, opacity 0.2s",
                marginBottom: "2px",
              }}
            >
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {selectedService !== "All" && (
              <span className="font-['Montserrat'] font-light text-[13px] md:text-[15px] opacity-50 uppercase tracking-[0.1em] ml-2 self-end mb-[6px] text-foreground">
                {String(filteredProjects.length).padStart(2, "0")}
              </span>
            )}
          </button>

          {/* Filter panel — document flow, max-height transition */}
          <div
            style={{
              maxHeight: panelOpen ? "400px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div className="flex flex-wrap gap-2 pt-5 pb-6">
              {/* "All" pill */}
              <button
                onClick={() => handleSelect("All")}
                className="transition-colors duration-150"
                style={{
                  border: "1px solid black",
                  borderRadius: "100px",
                  padding: "8px 18px",
                  fontSize: "11px",
                  letterSpacing: "1.5px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  fontFamily: "Montserrat, sans-serif",
                  background: selectedService === "All" ? "black" : "transparent",
                  color: selectedService === "All" ? "white" : "black",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (selectedService !== "All") {
                    ;(e.currentTarget as HTMLButtonElement).style.background = "black"
                    ;(e.currentTarget as HTMLButtonElement).style.color = "white"
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedService !== "All") {
                    ;(e.currentTarget as HTMLButtonElement).style.background = "transparent"
                    ;(e.currentTarget as HTMLButtonElement).style.color = "black"
                  }
                }}
              >
                All
              </button>

              {serviceCategories.map((cat) => {
                const isActive = selectedService === cat
                return (
                  <button
                    key={cat}
                    onClick={() => handleSelect(cat)}
                    className="transition-colors duration-150"
                    style={{
                      border: "1px solid black",
                      borderRadius: "100px",
                      padding: "8px 18px",
                      fontSize: "11px",
                      letterSpacing: "1.5px",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      fontFamily: "Montserrat, sans-serif",
                      background: isActive ? "black" : "transparent",
                      color: isActive ? "white" : "black",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        ;(e.currentTarget as HTMLButtonElement).style.background = "black"
                        ;(e.currentTarget as HTMLButtonElement).style.color = "white"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        ;(e.currentTarget as HTMLButtonElement).style.background = "transparent"
                        ;(e.currentTarget as HTMLButtonElement).style.color = "black"
                      }
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Layer 2: Blended project list ────────────────────────── */}
      <div
        className="relative z-10 w-full pb-32"
        style={{ mixBlendMode: "difference", color: "white" }}
      >
        <div
          className="w-full flex flex-col border-t border-white/20 pt-4"
          onMouseLeave={() => setActivePreviewImageSrc(null)}
        >
          {filteredProjects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              onHover={setActivePreviewImageSrc}
              activeFilter={selectedService}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

function ProjectRow({
  project,
  onHover,
  activeFilter,
}: {
  project: any
  onHover: (src: string | null) => void
  activeFilter: string
}) {
  const imageSrc = project.featuredImage || project.heroImage || project.image
  const slugStr = typeof project.slug === "string" ? project.slug : project.slug?.current

  const matchedService =
    activeFilter !== "All" &&
    Array.isArray(project.services) &&
    project.services.includes(activeFilter)
      ? activeFilter
      : null
  const service = matchedService ?? project.services?.[0] ?? project.industry ?? ""

  const clientName = project.client ? `${project.client} / ` : ""

  return (
    <Link
      href={`/projects/${slugStr}`}
      className="group block w-full cursor-pointer no-underline pointer-events-auto"
      onMouseEnter={() => imageSrc && onHover(imageSrc)}
    >
      <div className="w-full px-4 md:px-[60px] flex items-center justify-between py-[9px] overflow-hidden">
        <div className="relative inline-block isolate flex-shrink-0">
          <div className="absolute inset-0 bg-white mix-blend-difference z-10 transition-transform duration-200 ease-out origin-left scale-x-0 group-hover:scale-x-100 pointer-events-none" />
          <span className="relative z-20 mix-blend-difference font-['Montserrat'] font-medium text-[16px] md:text-[18px] uppercase tracking-wide block">
            {clientName}{project.title}
          </span>
        </div>
        {service && (
          <div className="hidden md:inline-block relative isolate flex-shrink-0 text-right">
            <div className="absolute inset-0 bg-white mix-blend-difference z-10 transition-transform duration-200 ease-out origin-left scale-x-0 group-hover:scale-x-100 pointer-events-none" />
            <span className="relative z-20 mix-blend-difference font-['Montserrat'] font-medium text-[13px] md:text-[14px] uppercase tracking-[0.12em] block">
              {service}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
