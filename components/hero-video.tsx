"use client"

import { useEffect, useRef, useState } from "react"

export function HeroVideo({ videoUrl }: { videoUrl?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // `past` = the user has scrolled below the hero container. We do NOT
  // unmount the component on this; the container stays in the DOM so
  // the ref keeps working and we can flip back to visible when the
  // user scrolls back up.
  const [past, setPast] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const tryPlay = () => {
      v.play().catch(() => {
        // Autoplay still blocked; nothing else to do.
      })
    }
    tryPlay()
    v.addEventListener("canplay", tryPlay, { once: true })
    v.addEventListener("loadedmetadata", tryPlay, { once: true })
    return () => {
      v.removeEventListener("canplay", tryPlay)
      v.removeEventListener("loadedmetadata", tryPlay)
    }
  }, [videoUrl])

  // Track whether the hero has scrolled past the viewport. Pause the
  // video while it's hidden, resume on scroll-back so it doesn't keep
  // burning data in the background.
  useEffect(() => {
    const handleScroll = () => {
      const c = containerRef.current
      if (!c) return
      const isPast = window.scrollY >= c.offsetHeight
      setPast(isPast)
      const v = videoRef.current
      if (!v) return
      if (isPast) {
        v.pause()
      } else if (v.paused) {
        v.play().catch(() => {})
      }
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  if (!videoUrl) return null

  return (
    <div
      ref={containerRef}
      aria-hidden={past}
      style={{ visibility: past ? "hidden" : "visible" }}
      className="fixed top-0 left-0 w-screen h-[64vw] min-h-[320px] max-h-[70vh] md:h-screen md:max-h-none z-0 overflow-hidden bg-black pointer-events-none"
    >
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
