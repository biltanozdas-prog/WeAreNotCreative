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
    const touchStartX = useRef<number | null>(null)
    const touchEndX = useRef<number | null>(null)

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

    // Touch handlers for mobile swipe
    const onTouchStart = (e: React.TouchEvent) => {
        touchEndX.current = null
        touchStartX.current = e.targetTouches[0].clientX
    }

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX
    }

    const onTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return
        const distance = touchStartX.current - touchEndX.current
        const minSwipeDistance = 50
        
        if (distance > minSwipeDistance) {
            handleNext() // swiped left
        } else if (distance < -minSwipeDistance) {
            handlePrev() // swiped right
        }
    }

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
            className="relative w-full h-[60vh] md:h-screen md:min-h-screen overflow-hidden bg-background"
            style={{ touchAction: "pan-y" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
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
                                sizes="100vw"
                                className="object-cover"
                                priority={isActive} // Priority load the active image
                            />
                        )}

                        {/* Overlay removed — images now render at full colour, no scrim. */}

                        {/* Invisible Navigation Halves (Hidden on mobile to allow swipe) */}
                        <div className="hidden md:flex absolute inset-0 z-10">
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
                            <div className="absolute bottom-[8vh] md:bottom-[24vh] left-[4vw] md:left-[3.5vw] flex flex-col items-start pointer-events-none">

                                {/* ANCHOR 1: Brand Row — left edge */}
                                <div className="flex items-center gap-[6px] md:gap-[10px] mb-[8px] md:mb-[12px]">
                                    {/* Circle logo */}
                                    <div className="w-[20px] h-[20px] md:w-[28px] md:h-[28px] bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="font-['Montserrat'] font-black text-white text-[10px] md:text-[13px] leading-none">
                                            W
                                        </span>
                                    </div>
                                    {/* Brand label — white background block */}
                                    <div className="bg-white text-black px-[10px] py-[6px] md:px-[14px] md:py-[10px] font-['Montserrat'] font-normal text-[10px] md:text-[13px] leading-none">
                                        WeAreNotCreative
                                    </div>
                                </div>

                                {/* ANCHOR 2: Client Name — offset right */}
                                {(project.client || project.title) && (
                                    <div className="ml-[40px] md:ml-[70px] mb-[10px] md:mb-[14px] max-w-[85vw]">
                                        <div className="bg-white text-black inline-block px-[12px] py-[8px] md:px-[16px] md:py-[12px] text-[11px] md:text-[28px] font-black font-['Montserrat'] leading-[0.9] uppercase tracking-[-0.02em] whitespace-normal md:whitespace-nowrap">
                                            {project.client || project.title}
                                        </div>
                                    </div>
                                )}

                                {/* ANCHOR 3: Description + Dots — intermediate offset */}
                                <div className="ml-[15px] md:ml-[30px] flex flex-row items-start gap-[10px] md:gap-[14px]">

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
                                        <div
                                            className="font-['Montserrat'] font-black leading-none uppercase flex items-center justify-center text-center transition-colors duration-150"
                                            style={{
                                                background: "transparent",
                                                border: "1px solid white",
                                                color: "white",
                                                fontSize: "9px",
                                                letterSpacing: "0.2em",
                                                padding: "8px 16px",
                                                borderRadius: 0,
                                            }}
                                            onMouseEnter={(e) => {
                                                const el = e.currentTarget as HTMLDivElement
                                                el.style.background = "white"
                                                el.style.color = "black"
                                            }}
                                            onMouseLeave={(e) => {
                                                const el = e.currentTarget as HTMLDivElement
                                                el.style.background = "transparent"
                                                el.style.color = "white"
                                            }}
                                        >
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
