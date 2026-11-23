"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/context/ThemeContext"
import { DRAFT_LABEL, THEMES } from "@/data/config"
import { cn } from "@/lib/cn"

export function DraftBadge() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="glass fixed bottom-4 left-4 z-[60] flex items-center gap-1 rounded-full p-1 text-[11px] font-medium text-ink">
      <span className="px-2 text-ink/60">{DRAFT_LABEL}</span>
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setTheme(t.id)}
          className="relative rounded-full px-3 py-1.5"
          aria-pressed={theme === t.id}
        >
          {theme === t.id ? (
            <motion.span layoutId="theme-pill" className="absolute inset-0 rounded-full gold-fill" transition={{ type: "spring", damping: 26, stiffness: 300 }} />
          ) : null}
          <span className={cn("relative", theme === t.id ? "text-white" : "text-ink/70")}>{t.label}</span>
        </button>
      ))}
    </div>
  )
}
