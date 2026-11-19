import { useId } from "react"
import { cn } from "@/lib/cn"

/** Soft liquid-gold ribbon, rendered only in Variant A. */
export function GoldSwirl({ className, flip = false }: { className?: string; flip?: boolean }) {
  const id = useId().replace(/:/g, "")
  return (
    <svg
      viewBox="0 0 800 400"
      fill="none"
      preserveAspectRatio="none"
      className={cn("only-a swirl pointer-events-none absolute", className)}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b8860b" stopOpacity="0" />
          <stop offset="0.3" stopColor="#e3b341" stopOpacity="0.85" />
          <stop offset="0.6" stopColor="#fff1c9" stopOpacity="0.95" />
          <stop offset="1" stopColor="#8a6212" stopOpacity="0" />
        </linearGradient>
        <filter id={`b${id}`} x="-10%" y="-50%" width="120%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <path
        d="M-20 300 C 140 120, 300 380, 460 210 S 720 60, 820 150"
        stroke={`url(#g${id})`}
        strokeWidth="22"
        strokeLinecap="round"
        opacity="0.35"
        filter={`url(#b${id})`}
      />
      <path d="M-20 300 C 140 120, 300 380, 460 210 S 720 60, 820 150" stroke={`url(#g${id})`} strokeWidth="1.6" />
      <path d="M-20 318 C 150 150, 310 392, 470 228 S 730 84, 820 172" stroke={`url(#g${id})`} strokeWidth="0.8" opacity="0.7" />
      <path d="M-20 282 C 130 100, 290 360, 450 196 S 710 42, 820 130" stroke={`url(#g${id})`} strokeWidth="0.6" opacity="0.5" />
    </svg>
  )
}
