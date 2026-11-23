"use client"

import { Search, ShoppingBag, Truck } from "lucide-react"
import { Fragment, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  AdminCard,
  AdminHeader,
  EmptyState,
  fieldClass,
  formatDateTime,
  Pill,
  prettyStatus,
  statusTone,
  Thumb,
} from "@/components/admin/ui"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/format"

type Order = {
  _id: string
  orderNumber: string
  email: string
  name: string
  phone?: string
  status: string
  paymentStatus: string
  total: number
  trackingNumber?: string
  carrier?: string
  createdAt?: string
  lines?: { name?: string; image?: string; quantity?: number; price?: number }[]
  shipping?: { city?: string; state?: string; pincode?: string }
}

const STATUSES = ["pending_payment", "paid", "confirmed", "packed", "shipped", "delivered", "cancelled", "refunded"]

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [q, setQ] = useState("")
  const [filter, setFilter] = useState("all")
  const [openId, setOpenId] = useState<string | null>(null)
  const load = () => api<{ orders: Order[] }>("/api/admin/orders").then((d) => setOrders(d.orders))
  useEffect(() => {
    void load()
  }, [])

  const update = async (id: string, body: Record<string, string>) => {
    try {
      await api(`/api/admin/orders/${id}`, { method: "PATCH", body: JSON.stringify(body) })
      toast.success("Order updated")
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed")
    }
  }

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false
      if (!needle) return true
      return [o.orderNumber, o.email, o.name, o.phone].join(" ").toLowerCase().includes(needle)
    })
  }, [orders, q, filter])

  return (
    <div>
      <AdminHeader
        eyebrow="Fulfillment"
        title="Orders"
        description="Every checkout with customer, line items, payment, and shipping. Expand a row to ship with tracking."
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-[11px] tracking-wide uppercase ${
                filter === s ? "bg-sage-800 text-white" : "bg-white text-ink/55 ring-1 ring-sage-100"
              }`}
            >
              {prettyStatus(s)}
              {s !== "all" ? ` ${orders.filter((o) => o.status === s).length}` : ` ${orders.length}`}
            </button>
          ))}
        </div>
        <label className="relative w-full max-w-xs">
          <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-ink/35" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order, email, name" className={`${fieldClass} pl-9`} />
        </label>
      </div>

      <AdminCard className="mt-4 overflow-hidden">
        {visible.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="bg-sage-50/60 text-[11px] tracking-[0.16em] text-ink/45 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="font-medium">Customer</th>
                  <th className="font-medium">Items</th>
                  <th className="font-medium">Status</th>
                  <th className="font-medium">Pay</th>
                  <th className="font-medium">Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visible.map((o) => (
                  <Fragment key={o._id}>
                    <tr className="border-t border-sage-50">
                      <td className="px-4 py-3">
                        <p className="font-medium">{o.orderNumber}</p>
                        <p className="text-[11px] text-ink/45">{formatDateTime(o.createdAt)}</p>
                      </td>
                      <td>
                        <p>{o.name}</p>
                        <p className="text-[12px] text-ink/45">{o.email}</p>
                      </td>
                      <td>
                        <div className="flex -space-x-2">
                          {(o.lines ?? []).slice(0, 3).map((line, i) => (
                            <Thumb key={`${o._id}-img-${i}`} src={line.image} alt={line.name} size="sm" />
                          ))}
                        </div>
                        <p className="mt-1 text-[11px] text-ink/45">{o.lines?.reduce((s, l) => s + (l.quantity ?? 0), 0) || 0} items</p>
                      </td>
                      <td>
                        <select
                          value={o.status}
                          onChange={(e) => void update(o._id, { status: e.target.value })}
                          className="rounded-full bg-ivory px-2 py-1 text-[12px] ring-1 ring-sage-100"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {prettyStatus(s)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <Pill tone={statusTone(o.paymentStatus)}>{prettyStatus(o.paymentStatus)}</Pill>
                      </td>
                      <td className="font-medium">{formatINR(o.total)}</td>
                      <td className="pr-4">
                        <button
                          type="button"
                          className="text-[12px] text-sage-700 hover:underline"
                          onClick={() => setOpenId(openId === o._id ? null : o._id)}
                        >
                          {openId === o._id ? "Close" : "Details"}
                        </button>
                      </td>
                    </tr>
                    {openId === o._id ? (
                      <tr className="border-t border-sage-50 bg-sage-50/40">
                        <td colSpan={7} className="px-4 py-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <ul className="space-y-2">
                              {(o.lines ?? []).map((line, i) => (
                                <li key={`${o._id}-line-${i}`} className="flex items-center gap-3">
                                  <Thumb src={line.image} alt={line.name} />
                                  <div className="flex-1">
                                    <p className="text-sm">{line.name}</p>
                                    <p className="text-[12px] text-ink/45">
                                      Qty {line.quantity} · {formatINR(line.price ?? 0)}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <div>
                              <p className="text-[12px] text-ink/50">
                                Ship to {o.shipping?.city || "—"}
                                {o.shipping?.state ? `, ${o.shipping.state}` : ""} {o.shipping?.pincode || ""}
                              </p>
                              <p className="mt-1 text-[12px] text-ink/50">{o.phone}</p>
                              {o.trackingNumber ? (
                                <p className="mt-2 text-sm">
                                  {o.carrier} · {o.trackingNumber}
                                </p>
                              ) : null}
                              <form
                                className="mt-3 flex flex-wrap gap-2"
                                onSubmit={(e) => {
                                  e.preventDefault()
                                  const form = new FormData(e.currentTarget)
                                  void update(o._id, {
                                    trackingNumber: String(form.get("trackingNumber") || ""),
                                    carrier: String(form.get("carrier") || "Delhivery"),
                                    status: "shipped",
                                  })
                                }}
                              >
                                <input name="carrier" defaultValue={o.carrier || "Delhivery"} placeholder="Carrier" className={`${fieldClass} w-36`} />
                                <input name="trackingNumber" defaultValue={o.trackingNumber} required placeholder="Tracking number" className={`${fieldClass} w-44`} />
                                <button type="submit" className="inline-flex items-center gap-1 rounded-full bg-sage-800 px-4 py-2 text-[12px] text-white">
                                  <Truck size={13} /> Ship
                                </button>
                              </form>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<ShoppingBag size={22} />}
            title="No orders yet"
            body="When a customer pays, the order, pack shots, and shipping details will show here."
          />
        )}
      </AdminCard>
    </div>
  )
}
