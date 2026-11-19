import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { DEFAULT_THEME, type ThemeId } from "@/data/config"
import { ScrollTrigger } from "@/lib/gsap"

const STORAGE_KEY = "nd-theme"

export function getInitialTheme(): ThemeId {
  const saved = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
  return saved === "a" || saved === "c" ? saved : DEFAULT_THEME
}

const ThemeContext = createContext<{ theme: ThemeId; setTheme: (t: ThemeId) => void } | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(STORAGE_KEY, theme)
    // Font metrics differ between themes, so pinned sections need fresh measurements.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 250)
    return () => window.clearTimeout(id)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
