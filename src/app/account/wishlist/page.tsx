"use client"

import { Heart } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AccountCard, thumbSrc } from "@/components/account/ui"
import { PageBusy } from "@/components/Busy"
import { GoldButton } from "@/components/GoldButton"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/format"
import type { Product } from "@/data/products"

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const load = () =>
    api<{ products: Product[] }>("/api/wishlist")
      .then((d) => setProducts(d.products))
      .catch(() => setProducts([]))
  useEffect(() => {
    void load()
  }, [])

  const remove = async (slug: string) => {
    try {
      await api("/api/wishlist", { method: "POST", body: JSON.stringify({ productId: slug }) })
      toast.success("Removed from wishlist")
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update wishlist")
    }
  }

  return (
    <div>
      <p className="eyebrow">Account</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Wishlist</h1>
      <p className="mt-2 text-sm text-ink/55">Rituals you saved for later · {products?.length ?? 0} items</p>

      {products == null ? (
        <PageBusy label="Loading wishlist" />
      ) : products.length ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <li key={p.slug}>
              <AccountCard className="relative p-4">
                <button
                  type="button"
                  className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-[#faf6ec] text-gold-deep"
                  aria-label={`Remove ${p.name}`}
                  onClick={() => void remove(p.slug)}
                >
                  <Heart size={16} fill="currentColor" />
                </button>
                <Link href={`/product/${p.slug}`} className="block">
                  <span className="flex h-40 items-center justify-center rounded-2xl bg-[#faf6ec]">
                    <img src={thumbSrc(p.images)} alt={p.name} className="h-full w-full object-contain p-4" />
                  </span>
                  <p className="font-pcard mt-3 !text-[1.05rem]">{p.name}</p>
                  <p className="mt-1 font-medium">{formatINR(p.price)}</p>
                </Link>
              </AccountCard>
            </li>
          ))}
        </ul>
      ) : (
        <AccountCard className="mt-6 flex flex-col items-center py-14 text-center">
          <Heart className="text-ink/25" />
          <p className="mt-3 text-lg">Your wishlist is empty</p>
          <p className="mt-1 max-w-sm text-sm text-ink/50">Save a ritual from the shop and it will wait for you here.</p>
          <GoldButton to="/shop" className="mt-5 px-5 py-2.5 text-[12px]">
            Browse shop
          </GoldButton>
        </AccountCard>
      )}
    </div>
  )
}
