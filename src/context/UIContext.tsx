import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import type { Product } from "@/data/products"

type UIContextValue = {
  loading: boolean
  setLoading: (value: boolean) => void
  cartOpen: boolean
  setCartOpen: (value: boolean) => void
  quickView: Product | null
  openQuickView: (product: Product) => void
  closeQuickView: () => void
  viewerOpen: boolean
  setViewerOpen: (value: boolean) => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)

  const value = useMemo<UIContextValue>(
    () => ({
      loading,
      setLoading,
      cartOpen,
      setCartOpen,
      quickView,
      openQuickView: (product) => {
        setQuickView(product)
        setCartOpen(false)
      },
      closeQuickView: () => setQuickView(null),
      viewerOpen,
      setViewerOpen,
    }),
    [loading, cartOpen, quickView, viewerOpen],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error("useUI must be used within UIProvider")
  return ctx
}
