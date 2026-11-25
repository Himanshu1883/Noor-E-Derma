"use client"

import Link from "next/link"
import { ASSETS } from "@/data/config"

export function KitBanner() {
  return (
    <section className="bg-ivory px-3 pb-3 md:px-6 md:pb-6">
      <Link
        href="/product/tan-eraser-kit"
        className="mx-auto block max-w-7xl overflow-hidden rounded-[32px] shadow-[0_28px_60px_-28px_rgb(var(--tint)/0.45)] transition hover:brightness-[1.02] theme-a:rounded-[8px]"
        aria-label="Shop the Tan Eraser Ritual Kit"
      >
        <img
          src={ASSETS.tanKitBanner}
          alt="Erase tan, reveal brighter skin — a complete Tan Eraser kit for sun-tanned and dull looking skin"
          className="block h-auto w-full"
        />
      </Link>
    </section>
  )
}
