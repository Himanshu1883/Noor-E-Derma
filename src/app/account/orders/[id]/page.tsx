"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { formatDate } from "@/components/account/ui"
import { OrderTracker, type TrackPayload } from "@/components/order/OrderTracker"
import { api } from "@/lib/client"

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [track, setTrack] = useState<TrackPayload | null>(null)
  const [tab, setTab] = useState<"details" | "track">("track")
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    api<{ track: TrackPayload }>(`/api/orders/${id}`)
      .then((d) => setTrack(d.track))
      .catch(() => setMissing(true))
  }, [id])

  if (missing) {
    return <p className="text-sm text-ink/50">Order not found.</p>
  }

  if (!track) {
    return <p className="text-sm text-ink/50">Loading order…</p>
  }

  return (
    <div>
      <Link href="/account/orders" className="text-[12px] font-medium text-gold-deep">
        ← All orders
      </Link>
      <p className="eyebrow mt-4">Order</p>
      <h1 className="mt-2 text-4xl">#{track.orderNumber}</h1>
      <p className="mt-2 text-sm text-ink/55">{formatDate(track.createdAt)}</p>
      <div className="mt-6">
        <OrderTracker track={track} tab={tab} onTab={setTab} />
      </div>
    </div>
  )
}
