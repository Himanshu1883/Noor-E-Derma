"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ArrowLeft, Trash2 } from "lucide-react"
import {
  AdminBusy,
  AdminCard,
  AdminHeader,
  EmptyState,
  formatDate,
  formatDateTime,
  initials,
  Pill,
  prettyStatus,
  statusTone,
  Thumb,
} from "@/components/admin/ui"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/format"

type Address = {
  label?: string
  name?: string
  phone?: string
  line1?: string
  line2?: string
  city?: string
  state?: string
  pincode?: string
  country?: string
  isDefault?: boolean
}

type Order = {
  _id: string
  orderNumber: string
  status: string
  paymentStatus: string
  total: number
  createdAt?: string
  lines?: { name?: string; slug?: string; image?: string; quantity?: number; price?: number }[]
}

type User = {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  status: string
  createdAt?: string
  lastLoginAt?: string
  emailVerifiedAt?: string
  addresses?: Address[]
}

export default function AdminCustomerPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [missing, setMissing] = useState(false)

  const load = () =>
    api<{ user: User; orders: Order[] }>(`/api/admin/users/${id}`)
      .then((d) => {
        setUser(d.user)
        setOrders(d.orders)
      })
      .catch(() => setMissing(true))

  useEffect(() => {
    void load()
  }, [id])

  if (missing) {
    return (
      <div>
        <AdminHeader eyebrow="Accounts" title="Customer not found" />
        <Link href="/admin/users" className="mt-6 inline-flex items-center gap-1 text-sm text-sage-700">
          <ArrowLeft size={14} /> Back to customers
        </Link>
      </div>
    )
  }

  if (!user) return <AdminBusy label="Loading customer" />

  return (
    <div>
      <Link href="/admin/users" className="inline-flex items-center gap-1 text-[13px] text-sage-700">
        <ArrowLeft size={14} /> Customers
      </Link>
      <AdminHeader
        eyebrow="Customer"
        title={user.name}
        description={`${user.email} · ${user.phone || "No phone"}`}
        actions={
          user.role !== "admin" ? (
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-[12px] text-red-700 ring-1 ring-red-100"
              onClick={async () => {
                if (!confirm(`Delete ${user.name}?`)) return
                await api(`/api/admin/users/${user._id}`, { method: "DELETE" })
                toast.success("Customer deleted")
                router.push("/admin/users")
              }}
            >
              <Trash2 size={13} /> Delete
            </button>
          ) : null
        }
      />

      <div className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <aside className="lg:sticky lg:top-8 lg:col-start-2 lg:row-start-1">
          <AdminCard className="p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-sage-800 text-sm text-white">{initials(user.name)}</span>
              <div>
                <p className="font-medium">{user.name}</p>
                <Pill tone={user.role === "admin" ? "gold" : "neutral"}>{user.role}</Pill>
              </div>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-ink/40 uppercase">Email</dt>
                <dd className="break-all">{user.email}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-ink/40 uppercase">Phone</dt>
                <dd>{user.phone || "—"}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-ink/40 uppercase">Status</dt>
                <dd>
                  <button
                    type="button"
                    onClick={async () => {
                      const status = user.status === "active" ? "disabled" : "active"
                      await api(`/api/admin/users/${user._id}`, { method: "PATCH", body: JSON.stringify({ status }) })
                      await load()
                    }}
                  >
                    <Pill tone={statusTone(user.status)}>{user.status}</Pill>
                  </button>
                </dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-ink/40 uppercase">Joined</dt>
                <dd>{formatDate(user.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.16em] text-ink/40 uppercase">Last login</dt>
                <dd>{formatDate(user.lastLoginAt)}</dd>
              </div>
            </dl>
          </AdminCard>
        </aside>

        <div className="space-y-4 lg:col-start-1 lg:row-start-1">
          <AdminCard className="p-5">
            <h2 className="text-2xl">Addresses</h2>
            {user.addresses?.length ? (
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {user.addresses.map((a, i) => (
                  <li key={`${a.line1}-${i}`} className="rounded-2xl bg-ivory p-4 text-sm ring-1 ring-sage-100">
                    <p className="font-medium">
                      {a.label || "Address"} {a.isDefault ? <span className="text-[11px] text-sage-700">Default</span> : null}
                    </p>
                    <p className="mt-1 text-ink/70">{a.name}</p>
                    <p className="text-ink/70">{a.phone}</p>
                    <p className="mt-2 text-ink/60">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ""}
                      <br />
                      {a.city} {a.state} {a.pincode}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-ink/50">No saved addresses.</p>
            )}
          </AdminCard>

          <AdminCard className="overflow-hidden">
            <div className="px-5 pt-5">
              <h2 className="text-2xl">Order history</h2>
            </div>
            {orders.length ? (
              <ul className="mt-4 divide-y divide-sage-50">
                {orders.map((order) => (
                  <li key={order._id} className="px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <Link href={`/admin/orders?open=${encodeURIComponent(order.orderNumber)}`} className="font-medium hover:text-sage-800">
                          {order.orderNumber}
                        </Link>
                        <p className="text-[12px] text-ink/45">{formatDateTime(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatINR(order.total)}</p>
                        <Pill tone={statusTone(order.status)}>{prettyStatus(order.status)}</Pill>
                      </div>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {(order.lines ?? []).map((line, i) => (
                        <li key={`${order._id}-${i}`} className="flex items-center gap-3">
                          <Thumb src={line.image} alt={line.name} size="sm" />
                          <div className="min-w-0 flex-1">
                            {line.slug ? (
                              <Link href={`/product/${line.slug}`} className="text-sm hover:text-sage-800 hover:underline" target="_blank">
                                {line.name}
                              </Link>
                            ) : (
                              <p className="text-sm">{line.name}</p>
                            )}
                            <p className="text-[12px] text-ink/45">
                              Qty {line.quantity} · {formatINR(line.price ?? 0)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={<span />} title="No orders yet" body="When this customer checks out, their orders will list here with product links." />
            )}
          </AdminCard>
        </div>
      </div>
    </div>
  )
}
