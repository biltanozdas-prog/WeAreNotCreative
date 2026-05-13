"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/**
 * Sticky close button that appears only on /blog/[slug] routes.
 * Sits just below the site logo so the reader can always return to
 * the Journal index without scrolling.
 */
export function JournalCloseButton() {
  const pathname = usePathname()
  const isJournalPost =
    !!pathname && pathname.startsWith("/blog/") && pathname !== "/blog"

  if (!isJournalPost) return null

  return (
    <Link
      href="/blog"
      aria-label="Journal'a dön"
      className="
        fixed z-[1100]
        right-8 md:right-[60px]
        top-[68px] md:top-[112px] lg:top-[132px]
        flex items-center justify-center
        w-9 h-9 md:w-10 md:h-10
        text-[22px] md:text-[26px] leading-none
        text-foreground/40 hover:text-foreground
        transition-colors duration-150
        no-underline
        pointer-events-auto
      "
    >
      ×
    </Link>
  )
}
