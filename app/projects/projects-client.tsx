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
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Always show all 7 categories in canonical order.
  // The dropdown is never empty — all categories are selectable regardless
  // of whether existing projects have been tagged yet.
  const visibleCategories = serviceCategories

  const filteredProjects = useMemo(() => {
    if (selectedService === "All") return projects
    return projects.filter(p => Array.isArray(p.services) && p.services.includes(selectedService))
  }, [selectedService, projects])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = (value: string) => {
    setSelectedService(value)
    setDropdownOpen(false)
  }

  return (
    <div className="relative w-full min-h-screen">
      {/* Background Image Container */}
      <div
        className="fixed inset-0 pointer-events-none bg-white overflow-hidden z-0"
        style={{ width: "100%", height: "100%" }}
      >
        {projects.map((project) => {
          const imageSrc = project.featuredImage || project.heroImage || project.image
          if (!imageSrc) return null
          const isActive = activePreviewImageSrc === imageSrc
          return (
            <Image
              key={`bg-${project.id}`}
              src={imageSrc}
              alt={project.title}
              fill
              className={`object-cover transition-opacity duration-500 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
          )
        })}
      </div>

      {/* Foreground Content */}
      <div
        className="relative z-10 w-full pt-[140px] md:pt-[160px] pb-32 mix-blend-difference text-white pointer-events-none"
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

        {/* ── Filter Dropdown ─────────────────────────────────────── */}
        <div
          ref={dropdownRef}
          className="px-4 md:px-[60px] mb-8 pointer-events-auto relative"
        >
          {/* Trigger button */}
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className="flex items-center gap-3 group"
            aria-expanded={dropdownOpen}
          >
            <span className="font-['Montserrat'] font-black text-[clamp(28px,5vw,56px)] leading-none uppercase tracking-[-0.02em]">
              {selectedService === "All" ? "All Projects" : selectedService}
            </span>
            {/* Up / down chevrons */}
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

          {/* Dropdown list — only categories used in at least one project */}
          {dropdownOpen && (
            <div className="absolute top-full left-4 md:left-[60px] mt-3 flex flex-col gap-1 z-20">
              <button
                onClick={() => handleSelect("All")}
                className={`text-left font-['Montserrat'] font-medium text-[15px] md:text-[17px] uppercase tracking-[0.08em] py-[6px] transition-opacity ${
                  selectedService === "All" ? "opacity-100" : "opacity-40 hover:opacity-100"
                }`}
              >
                All Projects
              </button>
              {visibleCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleSelect(cat)}
                  className={`text-left font-['Montserrat'] font-medium text-[15px] md:text-[17px] uppercase tracking-[0.08em] py-[6px] transition-opacity ${
                    selectedService === cat ? "opacity-100" : "opacity-40 hover:opacity-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Project Index List ──────────────────────────────────── */}
        {/* onMouseLeave on the wrapper resets the bg image when cursor exits the list */}
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

  // Right-side service label logic:
  // - Filter active + project has that service → show the matched service
  // - Otherwise → show first service in the array, or industry as fallback
  const matchedService =
    activeFilter !== "All" && Array.isArray(project.services) && project.services.includes(activeFilter)
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
        {/* Left: Client / Title */}
        <div className="relative inline-block isolate flex-shrink-0">
          <div className="absolute inset-0 bg-white mix-blend-difference z-10 transition-transform duration-200 ease-out origin-left scale-x-0 group-hover:scale-x-100 pointer-events-none" />
          <span className="relative z-20 mix-blend-difference font-['Montserrat'] font-medium text-[16px] md:text-[18px] uppercase tracking-wide block">
            {clientName}{project.title}
          </span>
        </div>

        {/* Right: Service label — hidden on mobile */}
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
