"use client"

import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { useLightbox } from "@/components/lightbox-provider"

interface GalleryImage {
    src: string
    alt: string
}

export function AboutGallerySlider({ images }: { images: GalleryImage[] }) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const { isOpen: lightboxOpen, open } = useLightbox()

    const advance = useCallback(() => {
        setActiveIndex((i) => (i + 1) % images.length)
    }, [images.length])

    // Autoplay — pauses on hover or when lightbox is open
    useEffect(() => {
        if (images.length <= 1 || isHovered || lightboxOpen) {
            if (timerRef.current) clearInterval(timerRef.current)
            return
        }
        timerRef.current = setInterval(advance, 3000)
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [advance, images.length, isHovered, lightboxOpen])

    const handleClick = () => {
        const index = images.findIndex((img) => img.src === images[activeIndex].src)
        if (index >= 0) open(index)
    }

    if (!images || images.length === 0) return null

    return (
        <div
            className="relative w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Aspect-ratio frame — GPU layer to prevent compositing shifts */}
            <div
                className="relative w-full aspect-[4/3] overflow-hidden cursor-zoom-in"
                onClick={handleClick}
                role="button"
                tabIndex={0}
                aria-label="Open studio gallery"
                onKeyDown={(e) => e.key === "Enter" && handleClick()}
            >
                {images.map((img, i) => (
                    <div
                        key={img.src + i}
                        className={`absolute inset-0 transition-opacity duration-500 [will-change:opacity] [backface-visibility:hidden] ${
                            i === activeIndex ? "opacity-100" : "opacity-0"
                        }`}
                        aria-hidden={i !== activeIndex}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt || "Studio interior"}
                            fill
                            className="object-contain w-full h-full"
                            sizes="(max-width: 768px) 100vw, 45vw"
                            priority={i === 0}
                        />
                    </div>
                ))}
            </div>

        </div>
    )
}
