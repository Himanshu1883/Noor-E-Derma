import { AnimatePresence, motion } from "framer-motion"
import { ShoppingBag, X } from "lucide-react"
import { GoldButton } from "@/components/GoldButton"
import { QuantityStepper } from "@/components/QuantityStepper"
import { useCart } from "@/context/CartContext"
import { useUI } from "@/context/UIContext"
import { formatINR } from "@/lib/format"

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUI()
  const { lines, subtotal, setQuantity, remove } = useCart()

  return (
    <AnimatePresence>
      {cartOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-[85] bg-sage-800/25 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            initial={{ x: "105%" }}
            animate={{ x: 0 }}
            exit={{ x: "105%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-3 right-3 bottom-3 z-[86] flex w-[calc(100%-1.5rem)] max-w-md flex-col overflow-hidden rounded-[28px] bg-ivory shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="text-2xl">Your bag</h2>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-50" onClick={() => setCartOpen(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-auto px-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-50 text-sage-600">
                    <ShoppingBag />
                  </span>
                  <p className="mt-4 font-display text-xl">Your bag is empty</p>
                  <p className="mt-1 text-sm text-ink/60">Add a ritual to get glowing.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {lines.map((line) => (
                    <li key={line.product.id} className="flex gap-4 rounded-3xl bg-white p-3">
                      <img src={line.product.images[0].src} alt="" className="h-24 w-20 rounded-2xl object-cover" />
                      <div className="flex-1">
                        <p className="font-display text-lg leading-tight">{line.product.name}</p>
                        {line.product.partnerBrand ? (
                          <p className="text-[11px] text-gold-deep">{line.product.partnerBrand.label}</p>
                        ) : null}
                        <p className="mt-1 text-sm font-medium">{formatINR(line.product.price)}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <QuantityStepper value={line.quantity} onChange={(q) => setQuantity(line.product.id, q)} />
                          <button type="button" className="text-xs text-ink/50 underline-offset-2 hover:underline" onClick={() => remove(line.product.id)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="m-3 rounded-3xl bg-sage-50 p-5">
              <div className="mb-4 flex justify-between text-[15px]">
                <span>Subtotal</span>
                <span className="font-semibold">{formatINR(subtotal)}</span>
              </div>
              <GoldButton className="w-full" onClick={() => setCartOpen(false)}>
                Checkout (coming soon)
              </GoldButton>
              <p className="mt-2 text-center text-[11px] text-ink/50">Mock cart for this design draft.</p>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
