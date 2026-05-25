"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface FooterProps {
  email?: string
  instagramUrl?: string
  linkedinUrl?: string
  spotifyUrl?: string
  location?: string
}

const navLinks = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
]

export function SiteFooter({
  email,
  instagramUrl,
  linkedinUrl,
  spotifyUrl,
  location,
}: FooterProps) {
  const [time, setTime] = useState("")

  useEffect(() => {
    function updateTime() {
      const istanbul = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Istanbul",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date())
      setTime(istanbul)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="bg-accent text-white w-full">
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-white/10">
        {/* LEFT — identity + clock */}
        <div className="px-6 md:px-8 pt-8 pb-6 md:pt-10 md:pb-8 md:border-r border-white/10">
          <p className="text-[12px] md:text-[13px] font-black tracking-[.04em] mb-3 md:mb-4 leading-none">
            WeAreNotCreative
          </p>
          <p className="text-[10px] tracking-[.15em] uppercase text-white/35 mb-5 md:mb-6 leading-relaxed">
            Design as a<br />Cultural Practice.
          </p>
          <p className="text-[9px] tracking-[.12em] uppercase text-white/25">
            {location || "Istanbul / Global"}
          </p>
          <div className="mt-4 md:mt-5">
            <p
              className="text-[22px] md:text-[28px] font-light tracking-[-0.02em] leading-none tabular-nums text-white"
              suppressHydrationWarning
            >
              {time || "--:--:--"}
            </p>
            <p className="text-[8px] md:text-[9px] tracking-[.18em] uppercase text-white/30 mt-1.5">
              Istanbul Time
            </p>
          </div>
        </div>

        {/* CENTER — navigation (horizontal on mobile, vertical on desktop) */}
        <div className="px-6 md:px-8 py-6 md:pt-10 md:pb-8 border-t md:border-t-0 md:border-r border-white/10">
          <p className="text-[8px] md:text-[9px] tracking-[.2em] uppercase text-white/25 mb-3 md:mb-5">
            Explore
          </p>
          <nav>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 md:flex-col md:gap-0.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] md:text-[20px] lg:text-[22px] font-black tracking-[-0.02em] md:tracking-[-0.03em] uppercase text-white/50 hover:text-white transition-colors duration-150 md:leading-[1.2] block no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* RIGHT — contact + social */}
        <div className="px-6 md:px-8 py-6 md:pt-10 md:pb-8 border-t md:border-t-0 border-white/10">
          <p className="text-[8px] md:text-[9px] tracking-[.2em] uppercase text-white/25 mb-3 md:mb-5">
            Get in Touch
          </p>

          {email && (
            <a
              href={`mailto:${email}`}
              className="text-[11px] md:text-[12px] tracking-[.02em] text-white/65 hover:text-white transition-colors duration-150 block mb-4 md:mb-6 leading-relaxed break-all no-underline"
            >
              {email}
            </a>
          )}

          <ul className="flex gap-4 md:flex-col md:gap-2 mb-4 md:mb-8">
            {instagramUrl && (
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[.18em] uppercase text-white/40 hover:text-white transition-colors duration-150 flex items-center gap-1.5 no-underline"
                >
                  Instagram
                  <span className="opacity-50 text-[10px]">↗</span>
                </a>
              </li>
            )}
            {linkedinUrl && (
              <li>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[.18em] uppercase text-white/40 hover:text-white transition-colors duration-150 flex items-center gap-1.5 no-underline"
                >
                  LinkedIn
                  <span className="opacity-50 text-[10px]">↗</span>
                </a>
              </li>
            )}
          </ul>

          {/* Spotify — hidden on mobile to keep the footer compact */}
          {spotifyUrl && (
            <div className="hidden md:block pt-4 border-t border-white/[0.08]">
              <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group no-underline"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954] flex-shrink-0 inline-block" />
                <span className="text-[9px] tracking-[.15em] uppercase text-white/35 group-hover:text-white/65 transition-colors duration-150">
                  Listen while you browse →
                </span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 px-6 md:px-8 py-3.5 border-t border-white/[0.08]">
        <p className="text-[9px] tracking-[.04em] text-white/20">
          © 2024—26 WeAreNotCreative
        </p>
        <div className="flex items-center gap-5">
          <Link
            href="/privacy"
            className="text-[9px] tracking-[.12em] uppercase text-white/20 hover:text-white/50 transition-colors duration-150 no-underline"
          >
            Privacy Policy
          </Link>
          <span className="text-[9px] tracking-[.12em] uppercase text-white/20">
            Istanbul, TR
          </span>
        </div>
      </div>
    </footer>
  )
}
