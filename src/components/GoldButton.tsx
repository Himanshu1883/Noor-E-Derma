"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { Spinner } from "@/components/Busy"
import { scrollToHash } from "@/hooks/useLenis"
import { cn } from "@/lib/cn"

type Variant = "solid" | "outline" | "glass" | "black"
type Size = "md" | "sm"

type Props = {
  children: ReactNode
  className?: string
  variant?: Variant
  size?: Size
  to?: string
  href?: string
  type?: "button" | "submit"
  disabled?: boolean
  loading?: boolean
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

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-[13px] tracking-[0.12em] hover:-translate-y-0.5",
  sm: "h-8 px-3.5 text-[11px] tracking-[0.08em] shadow-none",
}

export function GoldButton({
  children,
  className,
  variant = "solid",
  size = "md",
  to,
  href,
  type = "button",
  disabled,
  loading,
  onClick,
}: Props) {
  const busy = Boolean(loading)
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase transition duration-300 active:translate-y-0 active:scale-[0.98]",
    sizes[size],
    styles[variant],
    (disabled || busy) && "pointer-events-none opacity-60",
    className,
  )
  const inner = (
    <>
      {busy ? <Spinner size={size === "sm" ? 12 : 14} /> : null}
      {children}
    </>
  )

  if (to) {
    return (
      <Link href={to} onClick={onClick} className={classes}>
        {inner}
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
        {inner}
      </a>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled || busy}>
      {inner}
    </button>
  )
}
