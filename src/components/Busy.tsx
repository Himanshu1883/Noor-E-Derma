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
