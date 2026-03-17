"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useLightbox } from "./lightbox-provider"

export function LightboxOverlay() {
  const { images, isOpen, activeIndex, close, next, prev } = useLightbox()
  const [mounted, setMounted] = useState(false)

  // Trigger CSS transition after mount
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setMounted(true))
    } else {
      setMounted(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const current = images[activeIndex]
  if (!current) return null

  const isFirst = activeIndex === 0
  const isLast = activeIndex === images.length - 1

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90"
        onClick={close}
        aria-hidden="true"
      />

      {/* Image container */}
      <div className="relative z-10 w-[90vw] h-[90vh] flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full">
          <Image
            src={current.src}
            alt={current.alt}
            fill
            className="object-contain"
            sizes="90vw"
            priority
          />
        </div>
      </div>

      {/* Left click zone — prev */}
      <button
        className="absolute left-0 top-0 w-1/2 h-full z-20 cursor-w-resize"
        onClick={prev}
        aria-label="Previous image"
        disabled={isFirst}
        style={{ opacity: isFirst ? 0 : 1 }}
      />

      {/* Right click zone — next */}
      <button
        className="absolute right-0 top-0 w-1/2 h-full z-20 cursor-e-resize"
        onClick={next}
        aria-label={isLast ? "Close lightbox" : "Next image"}
      />

      {/* Close button */}
      <button
        onClick={close}
        className="absolute top-6 right-6 z-30 text-white font-['Montserrat'] font-black text-[13px] uppercase tracking-[0.15em] hover:opacity-60 transition-opacity"
        aria-label="Close"
      >
        [ Close ]
      </button>

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-white font-['Montserrat'] font-light text-[12px] tracking-[0.2em] opacity-60">
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  )
}
