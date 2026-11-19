import { AnimatePresence, motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { GoldButton } from "@/components/GoldButton"
import { PartnerBadge } from "@/components/PartnerBadge"
import { StarRating } from "@/components/StarRating"
import { useCart } from "@/context/CartContext"
import { useUI } from "@/context/UIContext"
import { formatINR } from "@/lib/format"

export function QuickViewDrawer() {
  const { quickView: product, closeQuickView, setCartOpen } = useUI()
  const { add } = useCart()

  return (
    <AnimatePresence>
      {product ? (
        <>
          <motion.button
            type="button"
            aria-label="Close quick view"
            className="fixed inset-0 z-[85] bg-sage-800/25 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
          />
          <motion.aside
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-3 right-3 bottom-3 z-[86] w-[calc(100%-1.5rem)] max-w-lg overflow-auto rounded-[28px] bg-ivory shadow-2xl"
            data-lenis-prevent
          >
            <div className="relative">
              <img src={product.images[0].src} alt={product.images[0].alt} className="aspect-[4/3] w-full object-cover" />
              <button type="button" onClick={closeQuickView} aria-label="Close" className="glass absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full">
                <X size={16} />
              </button>
              {product.partnerBrand ? <PartnerBadge className="absolute bottom-4 left-4" label={product.partnerBrand.label} /> : null}
            </div>
            <div className="p-6">
              <p className="eyebrow">Quick view</p>
              <h2 className="mt-2 text-3xl">{product.name}</h2>
              <StarRating className="mt-3" rating={product.rating} count={product.reviewCount} />
              <p className="mt-4 text-3xl font-semibold text-gold-deep">{formatINR(product.price)}</p>
              {product.kitIncludes ? (
                <div className="mt-6 rounded-3xl bg-sage-50 p-5">
                  <p className="text-sm font-medium text-sage-800">In the kit</p>
                  <ul className="mt-3 grid gap-2 text-[14px] text-ink/80">
                    {product.kitIncludes.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check size={14} className="text-sage-600" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <p className="mt-5 text-sm font-medium text-ink/70">Packaging claims</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.benefits.map((b) => (
                  <span key={b.label} className="rounded-full bg-white px-3 py-1.5 text-[13px] ring-1 ring-sage-100">
                    {b.label}
                  </span>
                ))}
              </div>
              <GoldButton
                className="mt-7 w-full"
                onClick={() => {
                  add(product)
                  closeQuickView()
                  setCartOpen(true)
                }}
              >
                Add to Cart · {formatINR(product.price)}
              </GoldButton>
              {product.partnerBrand ? (
                <p className="mt-4 text-[12px] leading-relaxed text-ink/50">
                  Sold as a partner product. This is not a Noor E Derma product; NICONI Professional trademarks belong to their owners.
                </p>
              ) : null}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
