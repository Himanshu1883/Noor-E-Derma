import { Handshake } from "lucide-react"
import { cn } from "@/lib/cn"

export function PartnerBadge({
  label = "Partner brand: NICONI Professional",
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-white/85 px-3 py-1 text-[11px] font-medium text-gold-deep backdrop-blur",
        className,
      )}
    >
      <Handshake size={12} />
      {label}
    </span>
  )
}
