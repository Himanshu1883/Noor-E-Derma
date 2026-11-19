import { motion } from "framer-motion"
import { ArrowUpRight, Plus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { GoldButton } from "@/components/GoldButton"
import { PartnerBadge } from "@/components/PartnerBadge"
import { StarRating } from "@/components/StarRating"
import { useCart } from "@/context/CartContext"
import { useUI } from "@/context/UIContext"
import type { Product } from "@/data/products"
import { formatINR, savePercent } from "@/lib/format"

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  const { setCartOpen, openQuickView } = useUI()
  const navigate = useNavigate()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const save = savePercent(product.price, product.compareAt)

  const view = () => {
    if (product.hasDetailPage) navigate(`/product/${product.slug}`)
    else openQuickView(product)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group glass relative flex flex-col rounded-[32px] p-3 transition-shadow duration-500 hover:shadow-[0_0_0_1.5px_rgba(227,179,65,0.6),0_30px_60px_-24px_rgba(95,125,77,0.45)]"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 10 })
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <button type="button" onClick={view} className="relative block overflow-hidden rounded-[26px] bg-peach" aria-label={`View ${product.name}`}>
        <img
          src={product.images[0].src}
          alt={product.images[0].alt}
          className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          style={{
            objectPosition: product.images[0].position ?? "center",
            transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {product.partnerBrand ? <PartnerBadge label={product.partnerBrand.label} /> : <span />}
          {save > 0 ? (
            <span className="rounded-full bg-sage-800 px-3 py-1 text-[11px] font-medium text-white">-{save}%</span>
          ) : null}
        </div>
        <span className="glass absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full opacity-0 transition group-hover:opacity-100">
          <ArrowUpRight size={18} />
        </span>
      </button>

      <div className="flex flex-1 flex-col px-3 pt-5 pb-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-sage-600">
            {product.netWeight ?? (product.isBundle ? "210 ml + 100 ml" : "5-piece kit")}
          </p>
          <StarRating rating={product.rating} />
        </div>
        <h3 className="mt-2 text-2xl leading-tight">{product.name}</h3>
        <p className="mt-1 text-sm text-ink/60">{product.cardLine ?? product.tagline}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-ink">{formatINR(product.price)}</span>
            {product.compareAt ? <span className="text-sm text-ink/40 line-through">{formatINR(product.compareAt)}</span> : null}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <GoldButton variant="outline" className="py-2.5" onClick={view}>
            {product.hasDetailPage ? "View Details" : "Quick View"}
          </GoldButton>
          <GoldButton
            className="px-4 py-2.5"
            onClick={() => {
              add(product)
              setCartOpen(true)
            }}
          >
            <Plus size={16} /> Add to Cart
          </GoldButton>
        </div>
      </div>
    </motion.article>
  )
}
