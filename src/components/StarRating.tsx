import { Star } from "lucide-react"
import { cn } from "@/lib/cn"

export function StarRating({
  rating,
  count,
  className,
}: {
  rating: number
  count?: number
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < Math.round(rating) ? "fill-gold-bright text-gold-bright" : "text-sage-200"}
          />
        ))}
      </div>
      <span className="text-xs text-ink/60">
        {rating.toFixed(1)}
        {typeof count === "number" ? ` (${count} reviews)` : ""}
      </span>
    </div>
  )
}
