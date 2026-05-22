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

                        {/* Editorial Overlay — minimal: bottom gradient + title + View link */}
                        <div className="absolute inset-0 pointer-events-none z-20">
                            {/* Bottom gradient so text reads on any image */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background:
                                        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 40%)',
                                }}
                            />

                            <div className="absolute bottom-0 left-0 right-0 flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-6 px-[4vw] pb-[6vh] md:pb-[3vw]">
                                <div>
                                    {project.industry && (
                                        <p className="text-[9px] tracking-[.2em] uppercase text-white/50 mb-2">
                                            {project.industry}
                                        </p>
                                    )}
                                    <h3 className="text-[22px] md:text-[34px] lg:text-[40px] font-black tracking-[-0.025em] uppercase text-white leading-[1.02] max-w-[80vw]">
                                        {project.client || project.title}
                                    </h3>
                                </div>

                                {slugStr && (
                                    <Link
                                        href={`/projects/${slugStr}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="pointer-events-auto text-[9px] tracking-[.2em] uppercase text-white/60 hover:text-white flex items-center gap-2 transition-colors no-underline self-start md:self-end"
                                    >
                                        <span className="w-4 h-px bg-current inline-block" />
                                        View Project
                                    </Link>
                                )}
                            </div>

                            {/* Slide dots — minimal, top-right */}
                            <div className="absolute top-[3vh] md:top-[24px] right-[4vw] md:right-[3.5vw] flex items-center gap-[6px] pointer-events-none">
                                {displayProjects.map((_, i) => (
                                    <span
                                        key={`dot-${i}`}
                                        className={`w-[6px] h-[6px] rounded-full transition-colors duration-300 ${
                                            i === currentIndex ? 'bg-white' : 'bg-white/30'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )
            })}
        </section>
    )
}
