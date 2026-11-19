import { cn } from "@/lib/cn"

const seeds = [
  { left: 6, size: 14, dur: 14, delay: 0 },
  { left: 14, size: 8, dur: 11, delay: 3 },
  { left: 23, size: 20, dur: 17, delay: 6 },
  { left: 35, size: 10, dur: 12, delay: 1.5 },
  { left: 48, size: 16, dur: 15, delay: 8 },
  { left: 58, size: 7, dur: 10, delay: 4 },
  { left: 67, size: 22, dur: 18, delay: 2 },
  { left: 76, size: 11, dur: 13, delay: 7 },
  { left: 86, size: 15, dur: 16, delay: 5 },
  { left: 94, size: 9, dur: 11, delay: 9 },
]

export function Bubbles({ className, count = 10 }: { className?: string; count?: number }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {seeds.slice(0, count).map((b, i) => (
        <span
          key={i}
          className="bubble absolute -bottom-8 rounded-full border border-white/90 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(203,220,193,0.35)_55%,rgba(147,173,134,0.15))] shadow-[inset_0_-2px_6px_rgba(95,125,77,0.18)]"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.dur}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export function Droplet({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 52" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id="dropfill" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#e7f1e2" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#93ad86" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <path
        d="M20 2C20 2 4 22 4 33a16 16 0 0 0 32 0C36 22 20 2 20 2Z"
        fill="url(#dropfill)"
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="1.2"
      />
      <ellipse cx="13" cy="31" rx="3" ry="5" fill="#fff" opacity="0.85" />
    </svg>
  )
}
