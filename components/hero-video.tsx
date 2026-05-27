"use client"

import { useEffect, useRef, useState } from "react"

export function HeroVideo({ videoUrl }: { videoUrl?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => {
      v.play().catch(() => {
        // Autoplay still blocked; nothing else to do.
      })
    }
    // First attempt immediately, second once enough data is loaded
    // (iOS can reject the early play() call before metadata is ready).
    tryPlay()
    v.addEventListener("canplay", tryPlay, { once: true })
    v.addEventListener("loadedmetadata", tryPlay, { once: true })
    return () => {
      v.removeEventListener("canplay", tryPlay)
      v.removeEventListener("loadedmetadata", tryPlay)
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
    <div className="fixed top-0 left-0 w-screen h-[64vw] min-h-[320px] max-h-[70vh] md:h-screen md:max-h-none z-0 overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        playsInline
        loop
        muted
        autoPlay
        preload="auto"
      >
        <source type="video/mp4" src={videoUrl} />
      </video>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-[#000000]/30" />
    </div>
  )
}
