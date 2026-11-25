"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { GoldButton } from "@/components/GoldButton"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/format"

type Tracked = {
  orderNumber: string
  status: string
  paymentStatus: string
  trackingNumber?: string
  carrier?: string
  trackingUrl?: string
  total: number
}

export function TrackForm() {
  const [result, setResult] = useState<Tracked | null>(null)
  const [pending, setPending] = useState(false)
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending(true)
    try {
      const data = await api<Tracked>("/api/track", {
        method: "POST",
        body: JSON.stringify({ orderId: form.get("orderId"), phone: form.get("phone") }),
      })
      setResult(data)
      toast.success("Order found")
    } catch (err) {
      setResult(null)
      toast.error(err instanceof Error ? err.message : "Could not find that order")
    } finally {
      setPending(false)
    }
  }
  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="orderId" required placeholder="e.g. ND-20261123-AB12" className="w-full rounded-full bg-white/80 px-4 py-3 text-sm outline-none ring-1 ring-sage-100" />
        <input name="phone" required placeholder="Checkout phone" className="w-full rounded-full bg-white/80 px-4 py-3 text-sm outline-none ring-1 ring-sage-100" />
        <GoldButton type="submit" loading={pending}>
          {pending ? "Looking up" : "Track"}
        </GoldButton>
      </form>
      {result ? (
        <div className="mt-6 rounded-2xl bg-white/80 p-4 text-sm">
          <p className="font-medium">{result.orderNumber}</p>
          <p className="mt-1 text-ink/60">
            {result.status} · {result.paymentStatus} · {formatINR(result.total)}
          </p>
          {result.trackingNumber ? (
            <p className="mt-2">
              {result.carrier} {result.trackingNumber}
              {result.trackingUrl ? (
                <a href={result.trackingUrl} className="ml-2 underline" target="_blank" rel="noreferrer">
                  Open tracking
                </a>
              ) : null}
            </p>
          ) : (
            <p className="mt-2 text-ink/50">No AWB yet — we will add tracking when the parcel ships.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
