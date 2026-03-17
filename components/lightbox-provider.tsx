"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export interface LightboxImage {
  src: string
  alt: string
}

interface LightboxContextType {
  images: LightboxImage[]
  isOpen: boolean
  activeIndex: number
  open: (index: number) => void
  close: () => void
  next: () => void
  prev: () => void
}

const LightboxContext = createContext<LightboxContextType | null>(null)

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  if (!ctx) throw new Error("useLightbox must be used inside LightboxProvider")
  return ctx
}

interface LightboxProviderProps {
  images: LightboxImage[]
  children: ReactNode
}

export function LightboxProvider({ images, children }: LightboxProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const open = useCallback((index: number) => {
    setActiveIndex(index)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const next = useCallback(() => {
    setActiveIndex((i) => {
      if (i >= images.length - 1) {
        setIsOpen(false)
        return i
      }
      return i + 1
    })
  }, [images.length])

  const prev = useCallback(() => {
    setActiveIndex((i) => Math.max(0, i - 1))
  }, [])

  // Scroll lock
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

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, next, prev, close])

  return (
    <LightboxContext.Provider value={{ images, isOpen, activeIndex, open, close, next, prev }}>
      {children}
    </LightboxContext.Provider>
  )
}
