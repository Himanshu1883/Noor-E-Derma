"use client"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { DEFAULT_THEME, type ThemeId } from "@/data/config"
import { refreshMotionLayout } from "@/lib/motion-refresh"

const STORAGE_KEY = "nd-theme"

export function getInitialTheme(): ThemeId {
  return DEFAULT_THEME
}

const ThemeContext = createContext<{ theme: ThemeId; setTheme: (t: ThemeId) => void } | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = DEFAULT_THEME

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* private mode */
    }
    refreshMotionLayout({ clearHero: true })
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme: () => {} }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
