"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Pencil, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { GoldButton } from "@/components/GoldButton"
import { StarRating } from "@/components/StarRating"
import { WishButton } from "@/components/WishButton"
import { useCart } from "@/context/CartContext"
import { useUI } from "@/context/UIContext"
import type { Product } from "@/data/products"
import { cn } from "@/lib/cn"
import { formatINR, savePercent } from "@/lib/format"

export function ProductCard({
  product,
  compact = false,
  onAdminEdit,
}: {
  product: Product
  compact?: boolean
  onAdminEdit?: () => void
}) {
  const { add } = useCart()
  const { setCartOpen, openQuickView } = useUI()
  const router = useRouter()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const save = savePercent(product.price, product.compareAt)
  const cover = product.images?.find((img) => img.type !== "video" && img.src) ?? product.images?.[0]

  const view = () => {
    if (product.hasDetailPage) router.push(`/product/${product.slug}`)
    else openQuickView(product)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group glass relative flex min-w-0 flex-col transition-shadow duration-500 hover:shadow-[0_0_0_1.5px_rgba(227,179,65,0.6),0_30px_60px_-24px_rgb(var(--tint)/0.45)]",
        compact ? "rounded-[24px] p-2" : "rounded-[32px] p-3",
      )}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 10 })
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {onAdminEdit ? (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onAdminEdit()
          }}
          className={cn(
            "absolute z-20 inline-flex items-center gap-1 rounded-full bg-sage-800 font-medium tracking-[0.08em] text-white shadow-[0_8px_20px_-12px_rgba(0,0,0,0.45)] hover:bg-black",
            compact ? "top-3.5 left-3.5 px-2 py-1 text-[10px]" : "top-5 left-5 px-2.5 py-1.5 text-[11px]",
          )}
        >
          <Pencil size={compact ? 11 : 12} />
          Edit
        </button>
      ) : null}
      <WishButton
        product={product}
        size={compact ? 32 : 38}
        className={cn("absolute z-20", compact ? "top-3.5 right-3.5" : "top-5 right-5")}
      />
      <button
        type="button"
        onClick={view}
        className={cn("relative block overflow-hidden bg-peach", compact ? "rounded-[18px]" : "rounded-[26px]")}
        aria-label={`View ${product.name}`}
      >
        {cover ? (
          <img
            src={cover.src}
            alt={cover.alt}
            className={cn(
              "w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]",
              compact ? "aspect-[4/3]" : "aspect-square",
            )}
            style={{
              objectPosition: cover.position ?? "center",
              transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          />
        ) : (
          <div className={cn("bg-peach", compact ? "aspect-[4/3]" : "aspect-square")} />
        )}
        {save > 0 ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-sage-800 px-3 py-1 text-[11px] font-medium text-white">
            -{save}%
          </span>
        ) : null}
        <span
          className={cn(
            "glass absolute right-3 bottom-3 flex items-center justify-center rounded-full opacity-0 transition group-hover:opacity-100",
            compact ? "h-8 w-8" : "h-10 w-10",
          )}
        >
          <ArrowUpRight size={compact ? 16 : 18} />
        </span>
      </button>

      <div className={cn("flex flex-1 flex-col", compact ? "px-2.5 pt-3 pb-2" : "px-3 pt-5 pb-3")}>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-sage-600">
            {product.netWeight ?? (product.isBundle ? "210 ml + 100 ml" : "5-piece kit")}
          </p>
          {compact ? null : <StarRating rating={product.rating} />}
        </div>
        <h3 className={cn("font-pcard leading-tight", compact ? "mt-1 !text-lg" : "mt-2")}>{product.name}</h3>
        {compact ? null : <p className="mt-1 text-sm text-ink/60">{product.cardLine ?? product.tagline}</p>}
        <div className={cn("mt-auto flex items-end justify-between gap-3", compact ? "pt-2" : "pt-5")}>
          <div className="flex items-baseline gap-2">
            <span className={cn("font-semibold text-ink", compact ? "text-lg" : "text-2xl")}>{formatINR(product.price)}</span>
            {product.compareAt ? <span className="text-sm text-ink/40 line-through">{formatINR(product.compareAt)}</span> : null}
          </div>
        </div>
        <div className={cn("grid grid-cols-[1fr_auto] gap-1.5", compact ? "mt-2" : "mt-3")}>
          <GoldButton
            variant="outline"
            className="gap-1 px-2.5 py-1 text-[10px] tracking-[0.08em] shadow-none hover:translate-y-0"
            onClick={view}
          >
            {product.hasDetailPage ? "View Details" : "Quick View"}
          </GoldButton>
          <GoldButton
            variant="black"
            className="gap-1 px-2.5 py-1 text-[10px] tracking-[0.08em] shadow-none hover:translate-y-0"
            onClick={() => {
              void add(product)
              setCartOpen(true)
            }}
          >
            <Plus size={11} /> {compact ? "Add" : "Add to Cart"}
          </GoldButton>
        </div>
      </div>
    </motion.article>
  )
}
