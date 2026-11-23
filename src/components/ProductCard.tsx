"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { GoldButton } from "@/components/GoldButton"
import { StarRating } from "@/components/StarRating"
import { useCart } from "@/context/CartContext"
import { useUI } from "@/context/UIContext"
import type { Product } from "@/data/products"
import { cn } from "@/lib/cn"
import { formatINR, savePercent } from "@/lib/format"

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add } = useCart()
  const { setCartOpen, openQuickView } = useUI()
  const router = useRouter()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const save = savePercent(product.price, product.compareAt)

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
        "group glass relative flex flex-col transition-shadow duration-500 hover:shadow-[0_0_0_1.5px_rgba(227,179,65,0.6),0_30px_60px_-24px_rgb(var(--tint)/0.45)]",
        compact ? "rounded-[24px] p-2" : "rounded-[32px] p-3",
      )}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 10 })
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <button
        type="button"
        onClick={view}
        className={cn("relative block overflow-hidden bg-peach", compact ? "rounded-[18px]" : "rounded-[26px]")}
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.images[0].src}
          alt={product.images[0].alt}
          className={cn(
            "w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]",
            compact ? "aspect-[4/3]" : "aspect-square",
          )}
          style={{
            objectPosition: product.images[0].position ?? "center",
            transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {save > 0 ? (
            <span className="ml-auto rounded-full bg-sage-800 px-3 py-1 text-[11px] font-medium text-white">-{save}%</span>
          ) : null}
        </div>
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
