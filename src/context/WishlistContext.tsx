"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import { useUI } from "@/context/UIContext"
import type { Product } from "@/data/products"
import { api } from "@/lib/client"

const GUEST_KEY = "nd_wishlist"

type WishKey = { slug?: string; id?: string; _id?: string }

type WishlistValue = {
  ready: boolean
  products: Product[]
  wished: (item: WishKey) => boolean
  busy: (item: WishKey) => boolean
  toggle: (product: Product) => Promise<void>
  refresh: () => Promise<void>
}

const WishlistContext = createContext<WishlistValue | null>(null)

function keysOf(item: WishKey) {
  return [item.slug, item.id, item._id].filter((k): k is string => Boolean(k))
}

function readGuest(): string[] {
  try {
    const raw = localStorage.getItem(GUEST_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === "string") : []
  } catch {
    return []
  }
}

function writeGuest(keys: string[]) {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify([...new Set(keys)]))
  } catch {
    /* quota / private mode */
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const { openAuth } = useUI()
  const [ids, setIds] = useState<Set<string>>(new Set())
  const [products, setProducts] = useState<Product[]>([])
  const [ready, setReady] = useState(false)
  const inflight = useRef(new Set<string>())
  const [, bump] = useState(0)

  const applyKeys = useCallback((next: Iterable<string>) => {
    setIds(new Set([...next].filter(Boolean)))
  }, [])

  const refresh = useCallback(async () => {
    if (!user) {
      applyKeys(readGuest())
      setProducts([])
      setReady(true)
      return
    }
    try {
      const guest = readGuest()
      for (const key of guest) {
        try {
          await api("/api/wishlist", { method: "POST", body: JSON.stringify({ productId: key, wished: true }) })
        } catch {
          /* product may no longer exist */
        }
      }
      if (guest.length) writeGuest([])
      const data = await api<{ products: Product[]; keys?: string[] }>("/api/wishlist")
      setProducts(data.products)
      applyKeys(data.keys?.length ? data.keys : data.products.flatMap((p) => keysOf(p)))
    } catch {
      applyKeys([])
      setProducts([])
    } finally {
      setReady(true)
    }
  }, [applyKeys, user])

  useEffect(() => {
    if (authLoading) return
    void refresh()
  }, [authLoading, refresh])

  const wished = useCallback((item: WishKey) => keysOf(item).some((k) => ids.has(k)), [ids])

  const busy = useCallback((item: WishKey) => keysOf(item).some((k) => inflight.current.has(k)), [])

  const toggle = useCallback(
    async (product: Product) => {
      const keys = keysOf(product)
      const primary = product.slug || product._id || product.id
      if (!primary || inflight.current.has(primary)) return
      const next = !keys.some((k) => ids.has(k))

      inflight.current.add(primary)
      bump((n) => n + 1)
      setIds((prev) => {
        const copy = new Set(prev)
        if (next) keys.forEach((k) => copy.add(k))
        else keys.forEach((k) => copy.delete(k))
        return copy
      })

      if (!user) {
        const guest = new Set(readGuest())
        if (next) guest.add(primary)
        else keys.forEach((k) => guest.delete(k))
        writeGuest([...guest])
        inflight.current.delete(primary)
        bump((n) => n + 1)
        if (next) {
          openAuth("login")
          toast.message("Sign in to save this to your wishlist")
        } else {
          toast.success("Removed from saved items")
        }
        return
      }

      try {
        await api("/api/wishlist", {
          method: "POST",
          body: JSON.stringify({ productId: primary, wished: next }),
        })
        setProducts((prev) => {
          if (next) return prev.some((p) => p.slug === product.slug) ? prev : [...prev, product]
          return prev.filter((p) => p.slug !== product.slug)
        })
        toast.success(next ? "Saved to wishlist" : "Removed from wishlist")
      } catch (err) {
        setIds((prev) => {
          const copy = new Set(prev)
          if (next) keys.forEach((k) => copy.delete(k))
          else keys.forEach((k) => copy.add(k))
          return copy
        })
        toast.error(err instanceof Error ? err.message : "Could not update wishlist")
      } finally {
        inflight.current.delete(primary)
        bump((n) => n + 1)
      }
    },
    [ids, openAuth, user],
  )

  const value = useMemo<WishlistValue>(
    () => ({ ready, products, wished, busy, toggle, refresh }),
    [busy, products, ready, refresh, toggle, wished],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider")
  return ctx
}
