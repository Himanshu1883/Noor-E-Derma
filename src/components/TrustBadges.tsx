import { Leaf, Lock, RotateCcw, Sparkles } from "lucide-react"

const items = [
  { icon: Sparkles, label: "Dermat-inspired" },
  { icon: Leaf, label: "Cruelty-free" },
  { icon: Lock, label: "Secure payment" },
  { icon: RotateCcw, label: "Easy returns" },
]

export function TrustBadges() {
  return (
    <ul className="grid grid-cols-2 gap-2.5">
      {items.map(({ icon: Icon, label }) => (
        <li key={label} className="flex min-w-0 items-center gap-2.5 rounded-2xl bg-sage-50 px-3.5 py-3 text-[13px] text-ink/80">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sage-600">
            <Icon size={14} />
          </span>
          <span className="min-w-0 leading-tight">{label}</span>
        </li>
      ))}
    </ul>
  )
}
