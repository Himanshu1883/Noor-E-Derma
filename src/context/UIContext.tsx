"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import type { Product } from "@/data/products"

export type AuthMode = "login" | "register" | "forgot"

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
  authOpen: boolean
  authMode: AuthMode
  authNext: string
  authError: string
  openAuth: (mode?: AuthMode, opts?: { next?: string; error?: string }) => void
  closeAuth: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [authNext, setAuthNext] = useState("")
  const [authError, setAuthError] = useState("")

  const openQuickView = useCallback((product: Product) => {
    setQuickView(product)
    setCartOpen(false)
  }, [])

  const closeQuickView = useCallback(() => setQuickView(null), [])

  const openAuth = useCallback((mode: AuthMode = "login", opts?: { next?: string; error?: string }) => {
    setAuthMode(mode)
    setAuthNext(opts?.next ?? "")
    setAuthError(opts?.error ?? "")
    setCartOpen(false)
    setAuthOpen(true)
  }, [])

  const closeAuth = useCallback(() => {
    setAuthOpen(false)
    setAuthError("")
  }, [])

  const value = useMemo<UIContextValue>(
    () => ({
      loading,
      setLoading,
      cartOpen,
      setCartOpen,
      quickView,
      openQuickView,
      closeQuickView,
      viewerOpen,
      setViewerOpen,
      authOpen,
      authMode,
      authNext,
      authError,
      openAuth,
      closeAuth,
    }),
    [loading, cartOpen, quickView, openQuickView, closeQuickView, viewerOpen, authOpen, authMode, authNext, authError, openAuth, closeAuth],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error("useUI must be used within UIProvider")
  return ctx
}
