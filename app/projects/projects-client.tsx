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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  // Dropdown panel is rendered with fixed positioning OUTSIDE the
  // mix-blend-difference layer so it gets a solid background.
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null)
  const filterBtnRef = useRef<HTMLButtonElement>(null)
  const dropdownPanelRef = useRef<HTMLDivElement>(null)

  const filteredProjects = useMemo(() => {
    if (selectedService === "All") return projects
    return projects.filter(
      (p) => Array.isArray(p.services) && p.services.includes(selectedService)
    )
  }, [selectedService, projects])

  const toggleDropdown = () => {
    if (!dropdownOpen && filterBtnRef.current) {
      const rect = filterBtnRef.current.getBoundingClientRect()
      // fixed positioning → top/left are relative to viewport
      setDropdownPos({ top: rect.bottom + 8, left: rect.left })
    }
    setDropdownOpen((v) => !v)
  }

  // Close when clicking outside both the button and the panel
  useEffect(() => {
    if (!dropdownOpen) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        !filterBtnRef.current?.contains(target) &&
        !dropdownPanelRef.current?.contains(target)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [dropdownOpen])

  const handleSelect = (value: string) => {
    setSelectedService(value)
    setDropdownOpen(false)
  }

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

      {/* ── Layer 1: Blended foreground (header + filter btn + list) */}
      <div
        className="relative z-10 w-full pt-[140px] md:pt-[160px] pb-32 pointer-events-none"
        style={{ mixBlendMode: "difference", color: "white" }}
      >
        {/* Page header */}
        <div className="px-4 md:px-[60px] mb-10 md:mb-16 pointer-events-auto">
          <div className="flex items-center gap-4 mb-6">
            {pageData?.eyebrowLabel && (
              <span className="font-sans font-light text-[12px] md:text-[13px] uppercase tracking-[0.25em]">
                {pageData.eyebrowLabel}
              </span>
            )}
            <span className="w-6 h-px bg-white" />
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

        {/* Filter trigger button — inside blended layer so text inverts correctly */}
        <div className="px-4 md:px-[60px] mb-8 pointer-events-auto">
          <button
            ref={filterBtnRef}
            onClick={toggleDropdown}
            className="flex items-center gap-3 group"
            aria-expanded={dropdownOpen}
          >
            <span className="font-['Montserrat'] font-black text-[clamp(28px,5vw,56px)] leading-none uppercase tracking-[-0.02em]">
              {selectedService === "All" ? "All Projects" : selectedService}
            </span>
            <span className="flex flex-col gap-[3px] ml-1 opacity-40 group-hover:opacity-80 transition-opacity">
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                <path d="M1 7L7 1L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {selectedService !== "All" && (
              <span className="font-['Montserrat'] font-light text-[13px] md:text-[15px] opacity-50 uppercase tracking-[0.1em] ml-2 self-end mb-[6px]">
                {String(filteredProjects.length).padStart(2, "0")}
              </span>
            )}
          </button>
        </div>

        {/* Project index list */}
        <div
          className="w-full flex flex-col pointer-events-auto border-t border-white/20 pt-4"
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

      {/* ── Layer 2: Dropdown panel — OUTSIDE blended layer ────────
           Rendered with position:fixed so it sits above everything
           with a solid background, unaffected by mix-blend-difference. */}
      {dropdownOpen && dropdownPos && serviceCategories.length > 0 && (
        <div
          ref={dropdownPanelRef}
          className="fixed z-50 bg-background border-t-2 border-foreground flex flex-col py-3 min-w-[260px]"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          <button
            onClick={() => handleSelect("All")}
            className={`text-left font-['Montserrat'] font-medium text-[14px] md:text-[15px] uppercase tracking-[0.08em] px-6 py-[7px] transition-opacity text-foreground ${
              selectedService === "All" ? "opacity-100" : "opacity-40 hover:opacity-100"
            }`}
          >
            All Projects
          </button>
          {serviceCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleSelect(cat)}
              className={`text-left font-['Montserrat'] font-medium text-[14px] md:text-[15px] uppercase tracking-[0.08em] px-6 py-[7px] transition-opacity text-foreground ${
                selectedService === cat ? "opacity-100" : "opacity-40 hover:opacity-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

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
