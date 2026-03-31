"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useMemo, useRef, useEffect } from "react"

interface ServiceTag { _id: string; name: string }

export function ProjectsClient({
  projects,
  pageData,
  serviceTags = [],
}: {
  projects: any[]
  pageData?: any
  serviceTags?: ServiceTag[]
}) {
  const [activePreviewImageSrc, setActivePreviewImageSrc] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string>("All")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Only show service tags that are actually used in at least one project
  const usedServiceNames = useMemo(() => {
    const set = new Set<string>()
    projects.forEach(p => {
      if (Array.isArray(p.services)) p.services.forEach((s: string) => s && set.add(s))
    })
    return set
  }, [projects])

  const visibleTags = useMemo(
    () => serviceTags.filter(t => usedServiceNames.has(t.name)),
    [serviceTags, usedServiceNames]
  )

  const filteredProjects = useMemo(() => {
    if (selectedService === "All") return projects
    return projects.filter(p => Array.isArray(p.services) && p.services.includes(selectedService))
  }, [selectedService, projects])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = (name: string) => {
    setSelectedService(name)
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
            {/* Up/down arrows */}
            <span className="flex flex-col gap-[3px] ml-1 opacity-40 group-hover:opacity-80 transition-opacity">
              <svg
                width="14" height="8"
                viewBox="0 0 14 8"
                fill="none"
                className={`transition-transform duration-200 ${dropdownOpen ? "rotate-0" : "rotate-180"}`}
              >
                <path d="M1 7L7 1L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg
                width="14" height="8"
                viewBox="0 0 14 8"
                fill="none"
                className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
              >
                <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {selectedService !== "All" && (
              <span className="font-['Montserrat'] font-light text-[13px] md:text-[15px] opacity-50 uppercase tracking-[0.1em] ml-2 self-end mb-[6px]">
                {String(filteredProjects.length).padStart(2, "0")}
              </span>
            )}
          </button>

          {/* Dropdown list */}
          {dropdownOpen && (
            <div className="absolute top-full left-4 md:left-[60px] mt-3 flex flex-col gap-1 z-20 min-w-[200px]">
              {/* "All" option */}
              <button
                onClick={() => handleSelect("All")}
                className={`text-left font-['Montserrat'] font-medium text-[16px] md:text-[18px] uppercase tracking-[0.08em] py-2 transition-opacity ${
                  selectedService === "All" ? "opacity-100" : "opacity-40 hover:opacity-100"
                }`}
              >
                All Projects
              </button>
              {visibleTags.map(tag => (
                <button
                  key={tag._id}
                  onClick={() => handleSelect(tag.name)}
                  className={`text-left font-['Montserrat'] font-medium text-[16px] md:text-[18px] uppercase tracking-[0.08em] py-2 transition-opacity ${
                    selectedService === tag.name ? "opacity-100" : "opacity-40 hover:opacity-100"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Project Index List ──────────────────────────────────── */}
        <div className="w-full flex flex-col pointer-events-auto border-t border-white/20 pt-4">
          {filteredProjects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              onHover={setActivePreviewImageSrc}
              onLeave={() => setActivePreviewImageSrc(null)}
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
  onLeave,
  activeFilter,
}: {
  project: any
  onHover: (src: string | null) => void
  onLeave: () => void
  activeFilter: string
}) {
  const imageSrc = project.featuredImage || project.heroImage || project.image
  const slugStr = typeof project.slug === "string" ? project.slug : project.slug?.current

  const hasFilterMatch =
    activeFilter !== "All" &&
    (Array.isArray(project.services)
      ? project.services.includes(activeFilter)
      : project.industry === activeFilter)
  const service = hasFilterMatch
    ? activeFilter
    : project.services?.[0] || project.industry || "Project"

  const clientName = project.client ? `${project.client} / ` : ""

  return (
    <Link
      href={`/projects/${slugStr}`}
      className="group block w-full cursor-pointer no-underline pointer-events-auto"
      onMouseEnter={() => imageSrc && onHover(imageSrc)}
      onMouseLeave={onLeave}
    >
      <div className="w-full px-4 md:px-[60px] flex items-center justify-between py-[9px] overflow-hidden">
        {/* Left: Client / Title */}
        <div className="relative inline-block isolate flex-shrink-0">
          <div className="absolute inset-0 bg-white mix-blend-difference z-10 transition-transform duration-200 ease-out origin-left scale-x-0 group-hover:scale-x-100 pointer-events-none" />
          <span className="relative z-20 mix-blend-difference font-['Montserrat'] font-medium text-[16px] md:text-[18px] uppercase tracking-wide block">
            {clientName}{project.title}
          </span>
        </div>

        {/* Right: Service (hidden on mobile) */}
        <div className="hidden md:inline-block relative isolate flex-shrink-0 text-right">
          <div className="absolute inset-0 bg-white mix-blend-difference z-10 transition-transform duration-200 ease-out origin-left scale-x-0 group-hover:scale-x-100 pointer-events-none" />
          <span className="relative z-20 mix-blend-difference font-['Montserrat'] font-medium text-[13px] md:text-[14px] uppercase tracking-[0.12em] block">
            {service}
          </span>
        </div>
      </div>
    </Link>
  )
}
