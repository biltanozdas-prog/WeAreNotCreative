"use client"

import Link from "next/link"
import { useMenu } from "@/lib/menu-context"

export function Header() {
  const { openMenu } = useMenu()

  return (
    <header
      className="fixed top-0 left-0 w-full flex justify-between items-center z-[1000] pointer-events-none px-8 py-8 md:px-[60px] md:py-[50px]"
      style={{ mixBlendMode: "difference" }}
    >
      <div className="pointer-events-auto">
        <button
          onClick={openMenu}
          className="flex flex-col justify-between w-[40px] h-[22px] md:w-[60px] md:h-[35px] cursor-pointer bg-transparent border-none p-0"
          aria-label="Open menu"
        >
          <span className="block w-full h-[4px] md:h-[8px] bg-[#ffffff]" />
          <span className="block w-full h-[4px] md:h-[8px] bg-[#ffffff]" />
          <span className="block w-full h-[4px] md:h-[8px] bg-[#ffffff]" />
        </button>
      </div>
      <div className="pointer-events-auto">
        <Link
          href="/"
          className="text-[#ffffff] no-underline font-sans font-black leading-[0.8] tracking-[-0.05em] text-[24px] md:text-[40px] lg:text-[60px]"
        >
          WeAreNotCreative
        </Link>
      </div>
    </header>
  )
}
