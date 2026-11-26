"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { DEFAULT_THEME, type ThemeId } from "@/data/config"
import { refreshMotionLayout } from "@/lib/motion-refresh"

const STORAGE_KEY = "nd-theme"

export function getInitialTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === "a" || saved === "c" ? saved : DEFAULT_THEME
}

const ThemeContext = createContext<{ theme: ThemeId; setTheme: (t: ThemeId) => void } | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTheme(getInitialTheme())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.dataset.theme = theme
    localStorage.setItem(STORAGE_KEY, theme)
    refreshMotionLayout({ clearHero: true })
    const id = window.setTimeout(() => refreshMotionLayout({ clearHero: true }), 320)
    return () => window.clearTimeout(id)
  }, [theme, mounted])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
