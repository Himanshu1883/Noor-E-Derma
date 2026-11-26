"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/cn"

export function Spinner({ className, size = 16 }: { className?: string; size?: number }) {
  return <Loader2 size={size} className={cn("animate-spin", className)} aria-hidden />
}

export function InlineBusy({ label = "Loading", className }: { label?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[13px] text-ink/75", className)}>
      <Spinner size={16} />
      {label}
    </span>
  )
}

export function BusyOverlay({
  show,
  label = "Loading",
  className,
}: {
  show: boolean
  label?: string
  className?: string
}) {
  if (!show) return null
  return (
    <div
      className={cn(
        "absolute inset-0 z-10 grid place-items-center rounded-[inherit] bg-ivory/80 backdrop-blur-[1px]",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <InlineBusy label={label} />
    </div>
  )
}

export function PageBusy({ label = "Loading" }: { label?: string }) {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <InlineBusy label={label} />
    </div>
  )
}

export function PrefillOverlay({
  show,
  title = "Prefilling your details",
  hint = "Using your saved profile and address",
}: {
  show: boolean
  title?: string
  hint?: string
}) {
  if (!show) return null
  return (
    <div
      className="absolute inset-0 z-20 grid place-items-center rounded-[inherit] bg-ivory/80 backdrop-blur-[3px]"
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <div className="flex flex-col items-center px-6 text-center">
        <span className="relative grid h-12 w-12 place-items-center">
          <span className="absolute inset-0 rounded-full bg-white shadow-sm ring-1 ring-sage-100" />
          <span className="absolute inset-[3px] animate-spin rounded-full border-2 border-sage-100 border-t-gold-deep" />
        </span>
        <p className="mt-4 font-display text-2xl text-ink">{title}</p>
        <p className="mt-1 max-w-[16rem] text-[12px] leading-relaxed text-ink/50">{hint}</p>
      </div>
    </div>
  )
}
