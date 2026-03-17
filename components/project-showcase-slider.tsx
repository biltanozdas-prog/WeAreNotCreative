"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"

export interface Project {
    id?: string
    _id?: string
    slug: any
    title: string
    client?: string
    industry?: string
    services?: string[]
    excerpt?: string
    heroImage?: string
    image?: string
    order?: number
}

interface ProjectShowcaseSliderProps {
    projects: Project[]
}

export function ProjectShowcaseSlider({ projects }: ProjectShowcaseSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const sliderRef = useRef<HTMLElement>(null)

    const handleNext = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
    }, [projects.length])

    const handlePrev = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length)
    }, [projects.length])

    // Auto-rotate every 5 seconds unless hovered
    useEffect(() => {
        if (isHovered || projects.length <= 1) return

        const timer = setInterval(() => {
            handleNext()
        }, 5000)

        return () => clearInterval(timer)
    }, [isHovered, handleNext, projects.length])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNext()
            if (e.key === "ArrowLeft") handlePrev()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handleNext, handlePrev])

    // IntersectionObserver to toggle body data-attribute for logo visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        document.body.dataset.showcase = "active"
                    } else {
                        delete document.body.dataset.showcase
                    }
                })
            },
            {
                threshold: 0.1, // Trigger as soon as 10% is visible, or adjust to your liking (e.g. 0.5)
            }
        )

        if (sliderRef.current) {
            observer.observe(sliderRef.current)
        }

        return () => {
            observer.disconnect()
            delete document.body.dataset.showcase
        }
    }, [])

    if (!projects || projects.length === 0) return null

    // Require exactly 4 slides per user specs
    const displayProjects = projects.slice(0, 4)

    // Preload the next image based on limited array
    const nextIndex = (currentIndex + 1) % displayProjects.length
    const nextProject = displayProjects[nextIndex]

    return (
        <section
            ref={sliderRef}
            className="relative w-full h-screen min-h-screen overflow-hidden bg-background"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Preload Next Image for performance */}
            {nextProject?.heroImage && (
                <link rel="preload" href={nextProject.heroImage} as="image" />
            )}

            {/* Slider Images */}
            {displayProjects.map((project, index) => {
                const isActive = index === currentIndex
                const slugStr = typeof project.slug === 'string' ? project.slug : project.slug?.current

                return (
                    <div
                        key={project.id || project._id || index}
                        className={`absolute inset-0 block transition-opacity duration-1000 ease-in-out cursor-default ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                            }`}
                    >
                        {project.heroImage && (
                            <Image
                                src={project.heroImage}
                                alt={project.title}
                                fill
                                className="object-cover"
                                priority={isActive} // Priority load the active image
                            />
                        )}

                        {/* Subtle dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent pointer-events-none"></div>

                        {/* Invisible Navigation Halves */}
                        <div className="absolute inset-0 z-10 flex">
                            {/* Left Half -> Prev */}
                            <div
                                className="w-1/2 h-full cursor-[w-resize]"
                                onClick={handlePrev}
                                aria-label="Previous Slide"
                            />
                            {/* Right Half -> Next */}
                            <div
                                className="w-1/2 h-full cursor-[e-resize]"
                                onClick={handleNext}
                                aria-label="Next Slide"
                            />
                        </div>

                        {/* Editorial Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-20">

                            {/* Left Cluster — three-anchor asymmetric editorial layout */}
                            <div className="absolute bottom-[24vh] left-[3.5vw] flex flex-col items-start pointer-events-none">

                                {/* ANCHOR 1: Brand Row — left edge */}
                                <div className="flex items-center gap-[10px] mb-[12px]">
                                    {/* Circle logo */}
                                    <div className="w-[28px] h-[28px] bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="font-['Montserrat'] font-black text-white text-[13px] leading-none">
                                            W
                                        </span>
                                    </div>
                                    {/* Brand label — white background block */}
                                    <div className="bg-white text-black px-[14px] py-[10px] font-['Montserrat'] font-black text-[22px] leading-none">
                                        WeAreNotCreative
                                    </div>
                                </div>

                                {/* ANCHOR 2: Client Name — offset right */}
                                {(project.client || project.title) && (
                                    <div className="ml-[70px] mb-[14px]">
                                        <div className="bg-white text-black px-[16px] py-[12px] text-[34px] font-black font-['Montserrat'] leading-[0.9] uppercase tracking-[-0.02em] whitespace-nowrap">
                                            {project.client || project.title}
                                        </div>
                                    </div>
                                )}

                                {/* ANCHOR 3: Description + Dots — intermediate offset */}
                                <div className="ml-[30px] flex flex-row items-start gap-[14px]">

                                    {/* Description block */}
                                    {(() => {
                                        const raw = project.excerpt
                                        const excerptText =
                                            typeof raw === "string" && raw.trim()
                                                ? raw.trim()
                                                : Array.isArray(raw)
                                                ? raw
                                                    .flatMap((block: any) =>
                                                        block?.children?.map((c: any) => c?.text ?? "") ?? []
                                                    )
                                                    .join(" ")
                                                    .trim()
                                                : null
                                        return excerptText ? (
                                            <div className="bg-white text-black px-[12px] py-[10px] max-w-[240px] w-fit">
                                                <p className="font-['Montserrat'] font-light text-[11px] md:text-[12px] leading-[1.5] m-0">
                                                    {excerptText}
                                                </p>
                                            </div>
                                        ) : null
                                    })()}

                                    {/* Dots block */}
                                    <div className="bg-white px-[10px] py-[8px] flex flex-row items-center gap-[5px]">
                                        {displayProjects.map((_, i) => (
                                            <div
                                                key={`dot-${i}`}
                                                className={`w-[5px] h-[5px] rounded-full transition-colors duration-300 ${i === currentIndex ? "bg-black" : "bg-gray-300"}`}
                                            />
                                        ))}
                                    </div>

                                </div>

                            </div>

                            {/* Right CTA */}
                            {slugStr && (
                                <div className="absolute bottom-[8vh] right-[3vw] pointer-events-auto">
                                    <Link
                                        href={`/projects/${slugStr}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="bg-accent text-white px-[34px] py-[12px] text-[14px] font-black font-['Montserrat'] leading-none uppercase tracking-[0.02em] hover:bg-black transition-colors flex items-center justify-center text-center">
                                            VIEW PROJECTS
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </section>
    )
}
