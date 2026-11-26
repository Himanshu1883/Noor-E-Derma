"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { GoldButton } from "@/components/GoldButton"
import { PageHeader } from "@/components/page/PageHeader"
import { OrderTracker, type TrackPayload } from "@/components/order/OrderTracker"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/format"

type Listed = { orderNumber: string; status: string; total: number; createdAt?: string }

export function TrackOrderPage() {
  const { user } = useAuth()
  const params = useSearchParams()
  const preset = params.get("order") ?? ""
  const [pending, setPending] = useState(false)
  const [track, setTrack] = useState<TrackPayload | null>(null)
  const [tab, setTab] = useState<"details" | "track">("track")
  const [mine, setMine] = useState<Listed[]>([])

  const loadTrack = async (orderId: string, phone?: string) => {
    setPending(true)
    try {
      const data = await api<TrackPayload>("/api/track", {
        method: "POST",
        body: JSON.stringify({ orderId, phone: phone || undefined }),
      })
      setTrack(data)
      setTab("track")
    } catch (err) {
      setTrack(null)
      toast.error(err instanceof Error ? err.message : "Could not find that order")
    } finally {
      setPending(false)
    }
  }

  useEffect(() => {
    if (!user) return
    api<{ orders: Listed[] }>("/api/orders")
      .then((d) => setMine(d.orders ?? []))
      .catch(() => setMine([]))
  }, [user])

  useEffect(() => {
    if (preset && user) void loadTrack(preset)
  }, [preset, user])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    await loadTrack(String(form.get("orderId") ?? ""), String(form.get("phone") ?? ""))
  }

  return (
    <main className="dewy min-w-0 max-w-full overflow-x-clip pt-28 pb-24">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Track order" }]}
        eyebrow="Orders"
        title="Track"
        accent="your order"
        lede={user ? "Choose an order, or enter the ID from your confirmation email." : "Enter the order ID and the phone number used at checkout."}
      />

      <div className="mx-auto mt-10 max-w-3xl space-y-5 px-5 md:px-8">
        {user && mine.length ? (
          <div className="flex flex-wrap gap-2">
            {mine.slice(0, 8).map((order) => (
              <button
                key={order.orderNumber}
                type="button"
                onClick={() => void loadTrack(order.orderNumber)}
                className="rounded-full bg-white px-3 py-1.5 text-[12px] text-ink/70 ring-1 ring-sage-100 hover:ring-gold/40"
              >
                {order.orderNumber}
                <span className="text-ink/35"> · {formatINR(order.total)}</span>
              </button>
            ))}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="grid gap-3 rounded-[1.75rem] bg-white p-5 ring-1 ring-sage-100 md:grid-cols-[1fr_1fr_auto] md:p-6">
          <input
            name="orderId"
            required
            defaultValue={preset}
            placeholder="Order ID"
            className="w-full rounded-full bg-ivory px-4 py-3 text-sm outline-none ring-1 ring-sage-100"
          />
          <input
            name="phone"
            required={!user}
            placeholder={user ? "Phone (optional)" : "Checkout phone"}
            className="w-full rounded-full bg-ivory px-4 py-3 text-sm outline-none ring-1 ring-sage-100"
          />
          <GoldButton type="submit" loading={pending} className="w-full md:w-auto">
            {pending ? "Looking up" : "Track"}
          </GoldButton>
        </form>

        {track ? <OrderTracker track={track} tab={tab} onTab={setTab} /> : null}
      </div>
    </main>
  )
}
