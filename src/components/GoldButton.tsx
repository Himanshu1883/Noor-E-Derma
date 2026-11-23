"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { scrollToHash } from "@/hooks/useLenis"
import { cn } from "@/lib/cn"

type Variant = "solid" | "outline" | "glass" | "black"

type Props = {
  children: ReactNode
  className?: string
  variant?: Variant
  to?: string
  href?: string
  type?: "button" | "submit"
  onClick?: () => void
}

const styles: Record<Variant, string> = {
  solid:
    "gold-fill text-white shadow-[0_12px_30px_-10px_rgba(138,98,18,0.6)] hover:shadow-[0_16px_36px_-10px_rgba(138,98,18,0.75)]",
  black:
    "bg-black text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)] hover:bg-neutral-900 hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.55)]",
  outline: "border border-sage-600/40 text-sage-800 hover:border-sage-600 hover:bg-sage-50",
  glass: "glass text-ink hover:bg-white/80",
}

export function GoldButton({
  children,
  className,
  variant = "solid",
  to,
  href,
  type = "button",
  onClick,
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium tracking-[0.12em] uppercase transition duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    styles[variant],
    className,
  )

  if (to) {
    return (
      <Link href={to} onClick={onClick} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={(e) => {
          if (href.startsWith("#")) {
            e.preventDefault()
            scrollToHash(href)
          }
          onClick?.()
        }}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
