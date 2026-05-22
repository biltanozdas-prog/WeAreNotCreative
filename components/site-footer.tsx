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
        <div className="px-8 pt-10 pb-8 md:border-r border-white/10">
          <p className="text-[13px] font-black tracking-[.04em] mb-4 leading-none">
            WeAreNotCreative
          </p>
          <p className="text-[10px] tracking-[.15em] uppercase text-white/35 mb-6 leading-relaxed">
            Design as a<br />Cultural Practice.
          </p>
          <p className="text-[9px] tracking-[.12em] uppercase text-white/25">
            {location || "Istanbul / Global"}
          </p>
          <div className="mt-5">
            <p
              className="text-[28px] font-light tracking-[-0.02em] leading-none tabular-nums text-white"
              suppressHydrationWarning
            >
              {time || "--:--:--"}
            </p>
            <p className="text-[9px] tracking-[.18em] uppercase text-white/30 mt-1.5">
              Istanbul Time
            </p>
          </div>
        </div>

        {/* CENTER — navigation */}
        <div className="px-8 pt-10 pb-8 md:border-r border-white/10">
          <p className="text-[9px] tracking-[.2em] uppercase text-white/25 mb-5">
            Explore
          </p>
          <nav>
            <ul className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[22px] md:text-[20px] lg:text-[22px] font-black tracking-[-0.03em] uppercase text-white/50 hover:text-white transition-colors duration-150 leading-[1.2] block no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* RIGHT — contact + social */}
        <div className="px-8 pt-10 pb-8">
          <p className="text-[9px] tracking-[.2em] uppercase text-white/25 mb-5">
            Get in Touch
          </p>

          {email && (
            <a
              href={`mailto:${email}`}
              className="text-[12px] tracking-[.02em] text-white/65 hover:text-white transition-colors duration-150 block mb-6 leading-relaxed break-all no-underline"
            >
              {email}
            </a>
          )}

          <ul className="flex flex-col gap-2 mb-8">
            {instagramUrl && (
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] tracking-[.18em] uppercase text-white/40 hover:text-white transition-colors duration-150 flex items-center gap-2 no-underline"
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
                  className="text-[10px] tracking-[.18em] uppercase text-white/40 hover:text-white transition-colors duration-150 flex items-center gap-2 no-underline"
                >
                  LinkedIn
                  <span className="opacity-50 text-[10px]">↗</span>
                </a>
              </li>
            )}
          </ul>

          {/* Spotify */}
          {spotifyUrl && (
            <div className="pt-4 border-t border-white/[0.08]">
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 px-8 py-3.5 border-t border-white/[0.08]">
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
