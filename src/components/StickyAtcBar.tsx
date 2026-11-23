"use client"

import { AnimatePresence, motion } from "framer-motion"
import { GoldButton } from "@/components/GoldButton"
import { useCart } from "@/context/CartContext"
import { useUI } from "@/context/UIContext"
import type { Product } from "@/data/products"
import { formatINR } from "@/lib/format"

export function StickyAtcBar({ product, quantity, visible }: { product: Product; quantity: number; visible: boolean }) {
  const { add } = useCart()
  const { setCartOpen } = useUI()

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: "spring", damping: 26, stiffness: 260 }}
          className="fixed inset-x-3 bottom-3 z-40 md:inset-x-auto md:right-6 md:bottom-6 md:w-[460px]"
        >
          <div className="glass flex items-center gap-3 rounded-full p-2 pl-2.5">
            <img src={product.images[0].src} alt="" className="h-12 w-12 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-pcard truncate !text-[15px]">{product.name}</p>
              <p className="text-sm font-semibold text-gold-deep">{formatINR(product.price)}</p>
            </div>
            <GoldButton
              variant="black"
              className="px-5 py-3"
              onClick={() => {
                void add(product, quantity)
                setCartOpen(true)
              }}
            >
              Add to Cart
            </GoldButton>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
