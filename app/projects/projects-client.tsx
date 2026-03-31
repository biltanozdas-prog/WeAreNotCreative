"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useMemo } from "react"
import type { ElementRef } from "react"

export function ProjectsClient({ projects, pageData }: { projects: any[], pageData?: any }) {
  const [activePreviewImageSrc, setActivePreviewImageSrc] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string>("All")

  // Extract unique services dynamically
  const allServices = useMemo(() => {
    const servicesSet = new Set<string>()
    projects.forEach(p => {
      if (p.services && Array.isArray(p.services)) {
        p.services.forEach((s: string) => servicesSet.add(s))
      }
      if (p.industry && !p.services?.length) servicesSet.add(p.industry)
    })
    return ["All", ...Array.from(servicesSet).sort()]
  }, [projects])

  // Filter projects based on active selection
  const filteredProjects = useMemo(() => {
    if (selectedService === "All") return projects
    return projects.filter(p => {
      const pServices = p.services || []
      const pIndustry = p.industry ? [p.industry] : []
      return pServices.includes(selectedService) || pIndustry.includes(selectedService)
    })
  }, [selectedService, projects])

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

          // isActive is determined by matching the src to the global active preview
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
        {/* Locomotive Style Dynamic Filter (Top Bar) */}
        <div className="px-4 md:px-[60px] mb-8 pointer-events-auto flex flex-wrap gap-x-6 gap-y-2 items-center font-['Montserrat']">
          {allServices.map(service => {
            const isActive = selectedService === service
            return (
              <button
                key={service}
                onClick={() => setSelectedService(service)}
                className={`text-[clamp(24px,4vw,36px)] md:text-[clamp(32px,5vw,60px)] font-light tracking-tight transition-opacity leading-none ${
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-100"
                }`}
              >
                {service}
                {isActive && selectedService !== "All" && (
                  <span className="text-[12px] md:text-[14px] ml-2 align-top opacity-60">
                    {filteredProjects.length.toString().padStart(2, '0')}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {/* Header / Page Title area */}
        <div className="px-4 md:px-[60px] mb-12 md:mb-20 pointer-events-auto">
          <div className="flex items-center gap-4 mb-8">
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

        {/* Index List */}
        <div className="w-full flex flex-col pointer-events-auto border-t border-white/20 pt-4">
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

function ProjectRow({ project, onHover, activeFilter }: { project: any, onHover: (src: string) => void, activeFilter: string }) {
  const imageSrc = project.featuredImage || project.heroImage || project.image

  const handleMouseEnter = () => {
    if (imageSrc) {
      onHover(imageSrc)
    }
  }

  const slugStr = typeof project.slug === 'string' ? project.slug : project.slug?.current
  
  // Logic: Show the active filter if matched, otherwise show the first available service, or industry.
  const hasFilterMatch = activeFilter !== "All" && (project.services?.includes(activeFilter) || project.industry === activeFilter)
  const service = hasFilterMatch ? activeFilter : (project.services?.[0] || project.industry || "Project")
  
  const clientName = project.client ? `${project.client} / ` : ""

  return (
    <Link 
      href={`/projects/${slugStr}`}
      className="group block w-full cursor-pointer no-underline pointer-events-auto"
      onMouseEnter={handleMouseEnter}
    >
      {/* Row container */}
      <div className="w-full px-4 md:px-[60px] flex items-center justify-between py-[9px] overflow-hidden">
        
        {/* Left: Client / Title Container */}
        <div className="relative inline-block isolate flex-shrink-0">
          {/* Highlight Layer */}
          <div className="absolute inset-0 bg-white mix-blend-difference z-10 transition-transform duration-200 ease-out origin-left scale-x-0 group-hover:scale-x-100 pointer-events-none" />
          
          {/* Client Text */}
          <span className="relative z-20 mix-blend-difference font-['Montserrat'] font-medium text-[16px] md:text-[18px] uppercase tracking-wide block">
            {clientName}{project.title}
          </span>
        </div>
        
        {/* Right: Service Container (Hidden on Mobile) */}
        <div className="hidden md:inline-block relative isolate flex-shrink-0 text-right mt-2 md:mt-0">
          {/* Highlight Layer */}
          <div className="absolute inset-0 bg-white mix-blend-difference z-10 transition-transform duration-200 ease-out origin-left scale-x-0 group-hover:scale-x-100 pointer-events-none" />
          
          {/* Service Text */}
          <span className="relative z-20 mix-blend-difference font-['Montserrat'] font-medium text-[13px] md:text-[14px] uppercase tracking-[0.12em] block">
            {service}
          </span>
        </div>
      </div>
    </Link>
  )
}
