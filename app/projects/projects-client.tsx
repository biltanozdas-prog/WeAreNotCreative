"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useMemo } from "react"

export function ProjectsClient({
  projects,
  pageData,
  serviceCategories = [],
}: {
  projects: any[]
  pageData?: any
  serviceCategories?: string[]
}) {
  // bgImage only ever increases — once set it never returns to null
  const [bgImage, setBgImage] = useState<string | null>(null)
  // Track which project images have been loaded (by project id) — lazy load on first hover
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
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

  const headingText =
    selectedService === "All"
      ? "All Projects"
      : `All Projects — ${selectedService}`

  return (
    <div className="relative w-full min-h-screen">

      {/* ── Fixed background layer: white base + persistent hover image ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-white" />
        {projects.map((project) => {
          const imageSrc = project.featuredImage || project.heroImage || project.image
          if (!imageSrc || !loadedImages.has(project.id)) return null
          return (
            <Image
              key={`bg-${project.id}`}
              src={imageSrc}
              alt={project.title}
              fill
              sizes="100vw"
              className={`object-cover transition-opacity duration-500 ease-in-out ${
                bgImage === imageSrc ? "opacity-100" : "opacity-0"
              }`}
            />
          )
        })}
      </div>

      {/* ── Content layer: mix-blend-difference over entire page ──── */}
      <div
        className="relative z-10 w-full min-h-screen pt-[140px] md:pt-[160px] pb-32"
        style={{ mixBlendMode: "difference", color: "white" }}
      >

        {/* Page header */}
        <div className="px-4 md:px-[60px] mb-10 md:mb-16">
          <div className="flex items-center gap-4 mb-6">
            {pageData?.eyebrowLabel && (
              <span className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em]">
                {pageData.eyebrowLabel}
              </span>
            )}
            <span className="w-6 h-px bg-current opacity-40" />
            <span className="font-sans font-medium text-[12px] md:text-[13px] uppercase tracking-[0.05em]">
              {String(projects.length).padStart(2, "0")} Projects
            </span>
          </div>
          {pageData?.intro && (
            <p className="font-sans font-light text-[14px] md:text-[15px] max-w-[440px] leading-[1.6]">
              {pageData.intro}
            </p>
          )}
        </div>

        {/* Filter trigger */}
        <div className="px-4 md:px-[60px]">
          <button
            onClick={() => setPanelOpen((v) => !v)}
            className="flex items-center gap-3 group"
            aria-expanded={panelOpen}
          >
            <span className="font-['Montserrat'] font-black text-[clamp(28px,5vw,56px)] leading-none uppercase tracking-[-0.02em]">
              {headingText}
            </span>
            <span
              style={{
                display: "inline-block",
                transform: panelOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
                marginBottom: "2px",
                opacity: 0.6,
              }}
            >
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                <path
                  d="M1 1L7 7L13 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            {selectedService !== "All" && (
              <span className="font-['Montserrat'] font-light text-[13px] md:text-[15px] opacity-50 uppercase tracking-[0.1em] ml-2 self-end mb-[6px]">
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
              <FilterPill
                label="All"
                active={selectedService === "All"}
                onClick={() => handleSelect("All")}
              />
              {serviceCategories.map((cat) => (
                <FilterPill
                  key={cat}
                  label={cat}
                  active={selectedService === cat}
                  onClick={() => handleSelect(cat)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Project list — no onMouseLeave: bgImage persists once set */}
        <div className="w-full flex flex-col mt-2 pt-2">
          {filteredProjects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              onHover={(src, id) => {
                setLoadedImages(prev => new Set([...prev, id]))
                setBgImage(src)
              }}
              activeFilter={selectedService}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

// ── Filter pill ──────────────────────────────────────────────────────────────
// Inside mix-blend-difference parent:
//   Default → border/text white → renders black on white page
//   Active/hover → bg white, color black → renders black bg + white text on white page

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "1px solid currentColor",
        borderRadius: "100px",
        padding: "8px 18px",
        fontSize: "11px",
        letterSpacing: "1.5px",
        fontWeight: 500,
        textTransform: "uppercase",
        fontFamily: "Montserrat, sans-serif",
        background: active ? "white" : "transparent",
        color: active ? "black" : "inherit",
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = "white"
          el.style.color = "black"
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = "transparent"
          el.style.color = "inherit"
        }
      }}
    >
      {label}
    </button>
  )
}

// ── Project row ──────────────────────────────────────────────────────────────
// The sweep effect works through nested compositing:
//
//  1. `isolate` wrapper creates a new compositing group
//  2. Inside: white sweep rect with mix-blend-difference blends with the
//     group's transparent background → result: white rect in the group
//  3. White text with mix-blend-difference blends with the white rect →
//     result: black text on white rect in the group
//  4. The parent content div (also mix-blend-difference) composites the
//     group with the white page → white rect = black, black text = white
//
//  Visible result on white page:
//    • default: black text (white via parent blend vs white page)
//    • hover:   black sweep rectangle with white text ✓

function ProjectRow({
  project,
  onHover,
  activeFilter,
}: {
  project: any
  onHover: (src: string, id: string) => void
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
      onMouseEnter={() => imageSrc && onHover(imageSrc, project.id)}
      onTouchStart={() => imageSrc && onHover(imageSrc, project.id)}
    >
      <div className="w-full px-4 md:px-[60px] flex items-center justify-between py-[9px]">

        {/* Title — isolate group for sweep effect */}
        <div className="relative inline-block isolate flex-shrink-0">
          {/* White sweep rect: scales left→right on group-hover */}
          <div
            className="absolute inset-0 z-10 pointer-events-none origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
            style={{ background: "white", mixBlendMode: "difference" }}
          />
          <span
            className="relative z-20 font-['Montserrat'] font-medium text-[16px] md:text-[18px] uppercase tracking-wide block"
            style={{ mixBlendMode: "difference", color: "white" }}
          >
            {clientName}{project.title}
          </span>
        </div>

        {/* Service label — isolate group for sweep effect */}
        {service && (
          <div className="hidden md:inline-block relative isolate flex-shrink-0 text-right">
            <div
              className="absolute inset-0 z-10 pointer-events-none origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
              style={{ background: "white", mixBlendMode: "difference" }}
            />
            <span
              className="relative z-20 font-['Montserrat'] font-medium text-[13px] md:text-[14px] uppercase tracking-[0.12em] block"
              style={{ mixBlendMode: "difference", color: "white" }}
            >
              {service}
            </span>
          </div>
        )}

      </div>
    </Link>
  )
}
