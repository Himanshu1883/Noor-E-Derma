"use client"

import { HeartMark } from "@/components/HeartMark"
import { useWishlist } from "@/context/WishlistContext"
import type { Product } from "@/data/products"
import { cn } from "@/lib/cn"

export function WishButton({
  product,
  size = 36,
  className,
}: {
  product: Product
  size?: number
  className?: string
}) {
  const { wished, toggle, busy } = useWishlist()
  const on = wished(product)

  return (
    <button
      type="button"
      aria-label={on ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      aria-pressed={on}
      disabled={busy(product)}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void toggle(product)
      }}
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-white/92 shadow-[0_10px_22px_-14px_rgba(0,0,0,0.45)] ring-1 ring-black/[0.06] backdrop-blur-sm transition duration-200 hover:scale-105 active:scale-90 disabled:opacity-70",
        on ? "text-gold-deep" : "text-ink/40 hover:text-gold-deep",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <HeartMark filled={on} className="h-[54%] w-[54%] transition-transform duration-200" />
    </button>
  )
}
