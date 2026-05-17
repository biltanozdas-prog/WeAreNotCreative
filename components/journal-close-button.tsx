"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/**
 * Sticky close button that appears only on /blog/[slug] routes.
 * Sits just below the site logo so the reader can always return to
 * the Journal index without scrolling. Sized to a 44x44 touch target.
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
        right-8 md:right-[60px]
        top-[68px] md:top-[112px] lg:top-[132px]
        flex flex-col items-center justify-center gap-0.5
        min-w-[44px] min-h-[44px]
        text-foreground/35 hover:text-foreground
        transition-colors duration-150
        no-underline
        pointer-events-auto
      "
    >
      <span className="text-[18px] leading-none">×</span>
      <span className="text-[6px] tracking-[.15em] uppercase hidden md:block leading-none">
        Journal
      </span>
    </Link>
  )
}
