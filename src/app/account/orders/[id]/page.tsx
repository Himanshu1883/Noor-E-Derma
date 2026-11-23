"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { AccountCard, StatusChip, formatDate } from "@/components/account/ui"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/format"

type Line = { name: string; quantity: number; price: number; image?: string }
type Order = {
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  createdAt?: string
  trackingNumber?: string
  carrier?: string
  lines?: Line[]
  shipping?: { name?: string; line1?: string; city?: string; state?: string; pincode?: string; phone?: string }
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  useEffect(() => {
    api<{ order: Order }>(`/api/orders/${id}`)
      .then((d) => setOrder(d.order))
      .catch(() => setOrder(null))
  }, [id])

  if (!order) {
    return <p className="text-sm text-ink/50">Loading order…</p>
  }

  return (
    <div>
      <Link href="/account/orders" className="text-[12px] font-medium text-gold-deep">
        ← All orders
      </Link>
      <p className="eyebrow mt-4">Order</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl">#{order.orderNumber}</h1>
        <StatusChip status={order.status} />
      </div>
      <p className="mt-2 text-sm text-ink/55">
        {formatDate(order.createdAt)} · payment {order.paymentStatus}
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <AccountCard>
          <h2 className="text-lg">Items</h2>
          <ul className="mt-4 space-y-3">
            {(order.lines ?? []).map((l, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="h-14 w-14 overflow-hidden rounded-xl bg-[#faf6ec]">
                  {l.image ? <img src={l.image} alt="" className="h-full w-full object-contain p-1" /> : null}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{l.name}</p>
                  <p className="text-[12px] text-ink/50">Qty {l.quantity}</p>
                </div>
                <p className="text-sm font-medium">{formatINR(l.price * l.quantity)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-right text-lg font-medium">Total {formatINR(order.total)}</p>
        </AccountCard>
        <AccountCard>
          <h2 className="text-lg">Shipping</h2>
          {order.shipping ? (
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              {order.shipping.name}
              <br />
              {order.shipping.line1}
              <br />
              {order.shipping.city}, {order.shipping.state} {order.shipping.pincode}
              <br />
              {order.shipping.phone}
            </p>
          ) : (
            <p className="mt-3 text-sm text-ink/50">No shipping details.</p>
          )}
          {order.trackingNumber ? (
            <p className="mt-4 text-sm">
              {order.carrier} · {order.trackingNumber}
            </p>
          ) : (
            <p className="mt-4 text-[12px] text-ink/45">Tracking appears here once the order ships.</p>
          )}
        </AccountCard>
      </div>
    </div>
  )
}
