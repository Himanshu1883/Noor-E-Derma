import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { glowDuo, type Product } from "@/data/products"

export type CartLine = {
  product: Product
  quantity: number
}

type CartContextValue = {
  lines: CartLine[]
  count: number
  subtotal: number
  add: (product: Product, quantity?: number) => void
  remove: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0)
    const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)

    return {
      lines,
      count,
      subtotal,
      add: (product, quantity = 1) => {
        if (product.isBundle && product.bundleOf) {
          setLines((prev) => {
            const existing = prev.find((line) => line.product.id === glowDuo.id)
            if (existing) {
              return prev.map((line) =>
                line.product.id === glowDuo.id
                  ? { ...line, quantity: line.quantity + quantity }
                  : line,
              )
            }
            return [...prev, { product: glowDuo, quantity }]
          })
          return
        }
        setLines((prev) => {
          const existing = prev.find((line) => line.product.id === product.id)
          if (existing) {
            return prev.map((line) =>
              line.product.id === product.id
                ? { ...line, quantity: line.quantity + quantity }
                : line,
            )
          }
          return [...prev, { product, quantity }]
        })
      },
      remove: (id) => setLines((prev) => prev.filter((line) => line.product.id !== id)),
      setQuantity: (id, quantity) =>
        setLines((prev) =>
          quantity <= 0
            ? prev.filter((line) => line.product.id !== id)
            : prev.map((line) =>
                line.product.id === id ? { ...line, quantity } : line,
              ),
        ),
      clear: () => setLines([]),
    }
  }, [lines])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
