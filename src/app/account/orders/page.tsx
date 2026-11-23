"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ChevronRight, ShoppingBag } from "lucide-react"
import { AccountCard, StatusChip, formatDate } from "@/components/account/ui"
import { GoldButton } from "@/components/GoldButton"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/format"

type Order = {
  _id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  createdAt: string
  trackingNumber?: string
  lines?: { name?: string; image?: string; quantity?: number }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  useEffect(() => {
    api<{ orders: Order[] }>("/api/orders")
      .then((d) => setOrders(d.orders))
      .catch(() => setOrders([]))
  }, [])

  return (
    <div>
      <p className="eyebrow">Account</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Orders</h1>
      <p className="mt-2 text-sm text-ink/55">Every checkout, with pack shots, totals, and tracking when it ships.</p>

      <div className="mt-6 space-y-3">
        {orders.map((o) => (
          <AccountCard key={o._id} className="p-4 md:p-5">
            <Link href={`/account/orders/${o.orderNumber}`} className="flex flex-wrap items-center gap-4">
              <div className="flex -space-x-2">
                {(o.lines ?? []).slice(0, 3).map((line, i) => (
                  <span key={`${o._id}-${i}`} className="h-12 w-12 overflow-hidden rounded-xl bg-[#faf6ec] ring-2 ring-white">
                    {line.image ? <img src={line.image} alt="" className="h-full w-full object-contain p-1" /> : null}
                  </span>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">#{o.orderNumber}</p>
                <p className="text-[12px] text-ink/50">
                  {o.lines?.reduce((s, l) => s + (l.quantity ?? 0), 0) || 0} items · {formatDate(o.createdAt)}
                  {o.trackingNumber ? ` · ${o.trackingNumber}` : ""}
                </p>
              </div>
              <StatusChip status={o.status} />
              <p className="font-medium">{formatINR(o.total)}</p>
              <ChevronRight size={16} className="text-ink/30" />
            </Link>
          </AccountCard>
        ))}
        {!orders.length ? (
          <AccountCard className="flex flex-col items-center py-14 text-center">
            <ShoppingBag className="text-ink/25" />
            <p className="mt-3 text-lg">No orders yet</p>
            <p className="mt-1 text-sm text-ink/50">When you check out, your rituals will list here.</p>
            <GoldButton to="/shop" className="mt-5 px-5 py-2.5 text-[12px]">
              Shop now
            </GoldButton>
          </AccountCard>
        ) : null}
      </div>
    </div>
  )
}
