"use client"

import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { toast } from "sonner"
import { InlineBusy } from "@/components/Busy"
import { ProductForm, type AdminProduct } from "@/components/admin/ProductForm"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/client"
import { getLenis } from "@/hooks/useLenis"

export function StorefrontProductEditModal({
  productKey,
  onClose,
  onSaved,
}: {
  productKey: string
  onClose: () => void
  onSaved?: () => Promise<void> | void
}) {
  const { user } = useAuth()
  const [product, setProduct] = useState<AdminProduct | null>(null)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const lenis = getLenis()
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      lenis?.start()
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  useEffect(() => {
    if (user?.role !== "admin") {
      onClose()
      return
    }
    let cancelled = false
    setProduct(null)
    setError("")
    void api<{ product: AdminProduct }>(`/api/admin/products/${encodeURIComponent(productKey)}`)
      .then((data) => {
        if (cancelled) return
        if (!data.product?._id) {
          setError("This product is not in the catalog yet.")
          return
        }
        setProduct(data.product)
      })
      .catch((err) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : "Could not load product"
        setError(message)
        toast.error(message)
        if (message.toLowerCase().includes("admin") || message.toLowerCase().includes("sign in")) onClose()
      })
    return () => {
      cancelled = true
    }
  }, [productKey, user?.role, onClose])

  if (!mounted || user?.role !== "admin") return null

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-5">
      <button
        type="button"
        aria-label="Close editor"
        className="absolute inset-0 bg-sage-800/40 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="storefront-product-edit-title"
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        className="relative z-10 flex h-[calc(100dvh-1.5rem)] max-h-[52rem] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-28px_rgba(40,28,10,0.55)] ring-1 ring-sage-100"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-sage-50 px-5 py-3 md:px-7">
          <p id="storefront-product-edit-title" className="text-[12px] tracking-[0.16em] text-ink/50 uppercase">
            Admin · Edit product
          </p>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-sage-50 text-ink ring-1 ring-sage-100 hover:bg-sage-100"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        {product ? (
          <div className="min-h-0 flex-1 overflow-hidden">
            <ProductForm
              key={product._id}
              product={product}
              contained
              className="h-full min-h-0"
              onCancel={onClose}
              onSaved={async () => {
                await onSaved?.()
                onClose()
              }}
            />
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 place-items-center">
            {error ? (
              <div className="px-6 text-center">
                <p className="text-sm text-ink/70">{error}</p>
                <button type="button" className="mt-3 text-[13px] text-sage-800 hover:underline" onClick={onClose}>
                  Close
                </button>
              </div>
            ) : (
              <InlineBusy label="Loading product" />
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
