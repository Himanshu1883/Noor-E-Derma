"use client"

import { Check, Copy, PackageSearch } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { toast } from "sonner"
import { GoldButton } from "@/components/GoldButton"

function SuccessInner() {
  const params = useSearchParams()
  const order = params.get("order") ?? ""
  const pay = params.get("pay") ?? "cod"
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!order) return
    await navigator.clipboard.writeText(order)
    setCopied(true)
    toast.success("Order ID copied")
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <main className="dewy pt-28 pb-24">
      <div className="mx-auto max-w-lg px-5 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#3cba54] text-white shadow-[0_16px_40px_-12px_rgba(60,186,84,0.8)]">
          <Check size={36} strokeWidth={3} />
        </div>
        <p className="eyebrow mt-8">Hurray</p>
        <h1 className="mt-3 text-5xl leading-none">Order placed</h1>
        <p className="mt-4 text-ink/70">
          {pay === "cod"
            ? "Your Cash on Delivery order is confirmed. Keep the amount ready when it arrives."
            : "Payment received. Your ritual is being packed with care."}
        </p>
        {order ? (
          <div className="mt-6 rounded-[24px] bg-ivory px-5 py-4 ring-1 ring-sage-100">
            <p className="text-[11px] tracking-[0.16em] text-ink/45 uppercase">Track order ID</p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <p className="font-mono text-lg font-semibold tracking-wide">{order}</p>
              <button type="button" onClick={() => void copy()} className="grid h-8 w-8 place-items-center rounded-full bg-white ring-1 ring-sage-100" aria-label="Copy order ID">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <GoldButton to={order ? `/track-order?order=${encodeURIComponent(order)}` : "/track-order"}>
            <PackageSearch size={16} /> Track order
          </GoldButton>
          <Link href="/account/orders" className="inline-flex h-12 items-center rounded-full px-6 text-[13px] ring-1 ring-sage-200">
            View my orders
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense>
      <SuccessInner />
    </Suspense>
  )
}
