"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/cn"

export const fieldClass =
  "w-full rounded-xl bg-[#faf6ec] px-3.5 py-2.5 text-sm text-ink outline-none ring-1 ring-sage-100/80 placeholder:text-ink/35 focus:ring-gold/40 disabled:opacity-70"

export function AccountCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[22px] bg-white p-5 ring-1 ring-sage-100/90 md:p-6", className)}>
      {children}
    </section>
  )
}

export function initials(name?: string) {
  const parts = (name || "?").trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?"
}

export function formatDate(value?: string | Date | null) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value))
}

export function thumbSrc(images?: { src?: string; type?: string }[] | null, fallback?: string) {
  if (fallback) return fallback
  if (!images?.length) return ""
  const still = images.find((img) => img.type !== "video" && img.src)
  return still?.src || images[0]?.src || ""
}

export function orderLabel(status: string) {
  if (status === "delivered") return "Delivered"
  if (status === "shipped") return "Shipped"
  if (status === "cancelled") return "Cancelled"
  if (status === "refunded") return "Refunded"
  if (status === "pending_payment") return "Pending"
  return "Processing"
}

export function orderTone(status: string) {
  if (status === "delivered") return "bg-emerald-50 text-emerald-700"
  if (status === "shipped") return "bg-[#f6edd4] text-gold-deep"
  if (status === "cancelled" || status === "refunded") return "bg-red-50 text-red-700"
  if (status === "pending_payment") return "bg-amber-50 text-amber-800"
  return "bg-amber-50 text-amber-800"
}

export function StatusChip({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium", orderTone(status))}>
      {orderLabel(status)}
    </span>
  )
}

export function Avatar({ name, size = "md" }: { name?: string; size?: "sm" | "md" | "lg" }) {
  const box = size === "lg" ? "h-16 w-16 text-lg" : size === "sm" ? "h-9 w-9 text-[11px]" : "h-14 w-14 text-sm"
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-full gold-fill font-medium text-white", box)}>
      {initials(name)}
    </span>
  )
}
