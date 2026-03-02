"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMenu } from "@/lib/menu-context"
import { useEffect, useRef } from "react"

const menuLinks = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/services", label: "SERVICES" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/blog", label: "BLOG" },
  { href: "/contact", label: "CONTACT" },
]

export function MenuOverlay() {
  const { isOpen, closeMenu } = useMenu()
  const pathname = usePathname()
  const prevPathname = useRef(pathname)

  // Close menu only on actual route change (not on initial mount)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      closeMenu()
      prevPathname.current = pathname
    }
  }, [pathname, closeMenu])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#000000]/40 z-[999998] transition-opacity duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 left-0 w-full md:w-[38vw] md:max-w-[600px] h-screen bg-accent z-[999999] flex flex-col justify-between px-8 py-12 md:px-10 md:py-[60px] box-border transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div>
          <button
            onClick={closeMenu}
            className="font-sans font-light text-[14px] md:text-[16px] text-accent-foreground bg-transparent border-none cursor-pointer mb-12 p-0 tracking-[0.15em] uppercase"
            aria-label="Close menu"
          >
            {'[ Close ]'}
          </button>
        </div>

        <nav className="flex flex-col gap-3 md:gap-4">
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`font-sans font-black text-[36px] md:text-[60px] text-accent-foreground no-underline leading-[0.85] uppercase transition-opacity hover:opacity-60 ${pathname === link.href ? "opacity-60" : ""
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="font-sans font-light text-[12px] md:text-[14px] text-accent-foreground opacity-60 leading-relaxed tracking-[0.15em]">
          WeAreNotCreative
          <br />
          2026 Archive
        </div>
      </div>
    </>
  )
}
