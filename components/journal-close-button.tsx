"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/**
 * Sticky close button that appears only on /journal/[slug] routes.
 * Sits just below the site logo so the reader can always return to
 * the Journal index. Generously sized so it reads as a clear exit
 * affordance on both desktop and mobile.
 */
export function JournalCloseButton() {
  const pathname = usePathname()
  const isJournalPost =
    !!pathname && pathname.startsWith("/journal/") && pathname !== "/journal"

  if (!isJournalPost) return null

  return (
    <Link
      href="/journal"
      aria-label="Journal'a dön"
      className="
        fixed z-[10000]
        right-6 md:right-[60px]
        top-[64px] md:top-[112px] lg:top-[132px]
        flex flex-col items-center justify-center gap-1
        w-14 h-14 md:w-16 md:h-16
        text-foreground/55 hover:text-foreground
        transition-colors duration-150
        no-underline
        pointer-events-auto
      "
    >
      <span className="text-[34px] md:text-[42px] leading-none font-light">×</span>
      <span className="text-[7px] md:text-[8px] tracking-[.2em] uppercase leading-none">
        Journal
      </span>
    </Link>
  )
}
