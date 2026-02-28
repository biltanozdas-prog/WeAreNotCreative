"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"

interface MenuContextType {
  isOpen: boolean
  openMenu: () => void
  closeMenu: () => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openMenu = useCallback(() => setIsOpen(true), [])
  const closeMenu = useCallback(() => setIsOpen(false), [])

  const value = useMemo(() => ({ isOpen, openMenu, closeMenu }), [isOpen, openMenu, closeMenu])

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}
