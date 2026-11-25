"use client"

import Link from "next/link"
import { AccountCard, thumbSrc } from "@/components/account/ui"
import { PageBusy } from "@/components/Busy"
import { GoldButton } from "@/components/GoldButton"
import { HeartMark } from "@/components/HeartMark"
import { WishButton } from "@/components/WishButton"
import { useWishlist } from "@/context/WishlistContext"
import { formatINR } from "@/lib/format"

export default function WishlistPage() {
  const { products, ready } = useWishlist()

  return (
    <div>
      <p className="eyebrow">Account</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Wishlist</h1>
      <p className="mt-2 text-sm text-ink/55">Rituals you saved for later · {products.length} items</p>

      {!ready ? (
        <PageBusy label="Loading wishlist" />
      ) : products.length ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => (
            <li key={p.slug}>
              <AccountCard className="relative p-4">
                <WishButton product={p} size={36} className="absolute top-4 right-4 z-10" />
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
          <span className="grid h-12 w-12 place-items-center text-ink/25">
            <HeartMark className="h-7 w-7" />
          </span>
          <p className="mt-3 text-lg">Your wishlist is empty</p>
          <p className="mt-1 max-w-sm text-sm text-ink/50">Tap the heart on a product and it will wait for you here.</p>
          <GoldButton to="/shop" className="mt-5 px-5 py-2.5 text-[12px]">
            Browse shop
          </GoldButton>
        </AccountCard>
      )}
    </div>
  )
}
