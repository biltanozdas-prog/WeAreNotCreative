"use client"

import Image from "next/image"
import { useLightbox } from "@/components/lightbox-provider"

export function HeroImageClickable({ src, alt }: { src: string; alt: string }) {
  const { open, images } = useLightbox()

  const handleClick = () => {
    const index = images.findIndex((img) => img.src === src)
    if (index >= 0) open(index)
  }

  return (
    <div
      className="w-full h-[50vh] md:h-[85vh] bg-muted relative overflow-hidden mb-28 md:mb-36 cursor-zoom-in"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Open fullscreen: ${alt}`}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
    </div>
  )
}
