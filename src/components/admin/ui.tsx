"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

export function thumbSrc(images?: { src?: string; type?: string }[] | null) {
  if (!images?.length) return ""
  const still = images.find((img) => img.type !== "video" && img.src)
  return still?.src || images[0]?.src || ""
}

export function formatDate(value?: string | Date | null) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value))
}

export function formatDateTime(value?: string | Date | null) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

export const fieldClass =
  "w-full rounded-full bg-ivory px-4 py-2.5 text-sm text-ink outline-none ring-1 ring-sage-100 placeholder:text-ink/45 focus:ring-gold/50"

export const inputClass =
  "w-full max-w-full rounded-xl bg-ivory px-3.5 py-2.5 text-sm text-ink outline-none ring-1 ring-sage-100 placeholder:text-ink/45 focus:ring-gold/40"

export const labelClass = "mb-1.5 block text-[12px] font-semibold tracking-[0.12em] text-ink/80 uppercase"

export const hintClass = "mt-1 block text-[12px] text-ink/65"

export function AdminHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 text-4xl md:text-5xl">{title}</h1>
        {description ? <p className="mt-2 max-w-xl text-sm text-ink/70">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function AdminCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[24px] bg-white ring-1 ring-sage-100", className)}>{children}</div>
}

export function Thumb({
  src,
  alt,
  size = "md",
}: {
  src?: string
  alt?: string
  size?: "sm" | "md" | "lg"
}) {
  const box = size === "sm" ? "h-10 w-10" : size === "lg" ? "h-16 w-16" : "h-12 w-12"
  return (
    <span className={cn("shrink-0 overflow-hidden rounded-2xl bg-peach ring-1 ring-sage-100", box)}>
      {src ? <img src={src} alt={alt || ""} className="h-full w-full object-contain p-0.5" /> : <span className="block h-full w-full bg-sage-50" />}
    </span>
  )
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode
  tone?: "neutral" | "good" | "warn" | "bad" | "gold"
}) {
  const tones = {
    neutral: "bg-sage-50 text-sage-800",
    good: "bg-emerald-50 text-emerald-800",
    warn: "bg-amber-50 text-amber-900",
    bad: "bg-red-50 text-red-800",
    gold: "bg-[#f6edd4] text-gold-deep",
  }
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide uppercase", tones[tone])}>
      {children}
    </span>
  )
}

export function statusTone(status: string): "neutral" | "good" | "warn" | "bad" | "gold" {
  if (["paid", "confirmed", "delivered", "active", "completed"].includes(status)) return "good"
  if (["shipped", "packed", "sent"].includes(status)) return "gold"
  if (["pending_payment", "pending", "low"].includes(status)) return "warn"
  if (["cancelled", "refunded", "failed", "disabled"].includes(status)) return "bad"
  return "neutral"
}

export function prettyStatus(value: string) {
  return value.replace(/_/g, " ")
}

export function StockBar({
  available,
  stock,
  threshold = 8,
}: {
  available: number
  stock: number
  threshold?: number
}) {
  const pct = stock > 0 ? Math.min(100, Math.round((available / stock) * 100)) : 0
  const tone = available <= 0 ? "bg-red-500" : available <= threshold ? "bg-amber-500" : "bg-sage-600"
  return (
    <div className="min-w-[88px]">
      <div className="h-1.5 overflow-hidden rounded-full bg-sage-50">
        <div className={cn("h-full rounded-full", tone)} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-[11px] text-ink/45">
        {available} of {stock}
      </p>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-sage-50 text-sage-700">{icon}</span>
      <p className="mt-4 font-display text-2xl">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ink/55">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function initials(name?: string) {
  const parts = (name || "?").trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?"
}

export function AdminBusy({ label = "Loading" }: { label?: string }) {
  return (
    <div className="mt-8">
      <p className="mb-3 inline-flex items-center gap-2 text-[13px] text-ink/75">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/20 border-t-ink/70" />
        {label}
      </p>
      <div className="space-y-3">
        <div className="h-24 animate-pulse rounded-[24px] bg-white ring-1 ring-sage-100" />
        <div className="h-40 animate-pulse rounded-[24px] bg-white ring-1 ring-sage-100" />
      </div>
    </div>
  )
}
