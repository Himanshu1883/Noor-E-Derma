import { cn } from "@/lib/cn"

export function HeartMark({ filled, className }: { filled?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("block", className)} aria-hidden>
      <path
        d="M12 21.15c-.32 0-.64-.1-.9-.3-2.18-1.66-7.5-5.9-8.72-9.22C1.3 8.9 2.22 5.3 5.5 4.05c1.95-.74 4.16-.22 5.62 1.28L12 6.5l.88-1.17c1.46-1.5 3.67-2.02 5.62-1.28 3.28 1.25 4.2 4.85 3.12 7.58-1.22 3.32-6.54 7.56-8.72 9.22-.26.2-.58.3-.9.3Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.65}
        strokeLinejoin="round"
      />
    </svg>
  )
}
