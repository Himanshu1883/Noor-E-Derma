"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { api } from "@/lib/client"
import type { Product } from "@/data/products"

export type CartLine = {
  productId: string
  product: Product
  quantity: number
}

type CartContextValue = {
  lines: CartLine[]
  count: number
  subtotal: number
  ready: boolean
  add: (product: Product, quantity?: number) => Promise<void>
  remove: (id: string) => Promise<void>
  setQuantity: (id: string, quantity: number) => Promise<void>
  clear: () => Promise<void>
  refresh: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

function matches(line: CartLine, id: string, product?: Product) {
  return (
    line.productId === id ||
    line.product.id === id ||
    line.product.slug === id ||
    Boolean(product && (line.product.slug === product.slug || line.product.id === product.id))
  )
}

function normalize(payload: { lines?: CartLine[] }): CartLine[] {
  return (payload.lines ?? []).map((line) => ({
    productId: line.productId,
    product: line.product,
    quantity: line.quantity,
  }))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)
  const linesRef = useRef(lines)
  linesRef.current = lines

  const apply = useCallback((payload: { lines?: CartLine[] }) => {
    const next = normalize(payload)
    linesRef.current = next
    setLines(next)
  }, [])

  const persist = useCallback(
    async (productId: string, quantity: number) => {
      const data = await api<{ lines: CartLine[] }>("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity }),
      })
      apply(data)
    },
    [apply],
  )

  const refresh = useCallback(async () => {
    try {
      const data = await api<{ lines: CartLine[] }>("/api/cart")
      apply(data)
    } catch {
      /* storefront still works without a live database */
    } finally {
      setReady(true)
    }
  }, [apply])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const add = useCallback(
    async (product: Product, quantity = 1) => {
      const prev = linesRef.current
      const hit = prev.find((line) => matches(line, product.slug, product))
      const nextQty = (hit?.quantity ?? 0) + quantity
      const next = hit
        ? prev.map((line) => (matches(line, product.slug, product) ? { ...line, quantity: nextQty } : line))
        : [...prev, { productId: product.slug, product, quantity: nextQty }]
      linesRef.current = next
      setLines(next)
      toast.success("Added to bag")
      try {
        await persist(product.slug, nextQty)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Could not add to bag")
      }
    },
    [persist],
  )

  const remove = useCallback(
    async (id: string) => {
      const prev = linesRef.current
      const line = prev.find((item) => matches(item, id))
      const key = line?.product.slug ?? line?.productId ?? id
      const next = prev.filter((item) => !matches(item, id))
      linesRef.current = next
      setLines(next)
      try {
        await persist(key, 0)
      } catch {
        toast.error("Could not remove item")
        await refresh()
      }
    },
    [persist, refresh],
  )

  const setQuantity = useCallback(
    async (id: string, quantity: number) => {
      if (quantity <= 0) {
        await remove(id)
        return
      }
      const prev = linesRef.current
      const line = prev.find((item) => matches(item, id))
      const key = line?.product.slug ?? line?.productId ?? id
      const next = prev.map((item) => (matches(item, id) ? { ...item, quantity } : item))
      linesRef.current = next
      setLines(next)
      try {
        await persist(key, quantity)
      } catch {
        await refresh()
      }
    },
    [persist, refresh, remove],
  )

  const clear = useCallback(async () => {
    linesRef.current = []
    setLines([])
    try {
      await api("/api/cart", { method: "DELETE" })
    } catch {
      /* local fallback */
    }
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0)
    const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
    return { lines, count, subtotal, ready, refresh, add, remove, setQuantity, clear }
  }, [lines, ready, refresh, add, remove, setQuantity, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
