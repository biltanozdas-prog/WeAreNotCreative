"use client"

import { useEffect, useRef, useState } from "react"

export function HeroVideo({ videoUrl }: { videoUrl?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked
      })
    }
  }, [])

  // Hide video once user scrolls past the first viewport
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const vh = window.innerHeight
      setIsVisible(scrollY < vh * 1.2)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!videoUrl || !isVisible) return null

  return (
    <div className="fixed top-0 left-0 w-screen h-[50vh] md:h-screen z-[-1] overflow-hidden">
      <video
        ref={videoRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
        }}
        playsInline
        loop
        muted
        autoPlay
      >
        <source type="video/mp4" src={videoUrl} />
      </video>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#000000]/30" />
    </div>
  )
}
