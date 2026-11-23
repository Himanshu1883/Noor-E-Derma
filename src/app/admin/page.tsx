"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowUpRight,
  CheckCircle2,
  IndianRupee,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react"
import {
  AdminCard,
  AdminHeader,
  EmptyState,
  Pill,
  prettyStatus,
  statusTone,
  StockBar,
  Thumb,
  thumbSrc,
} from "@/components/admin/ui"
import { GoldButton } from "@/components/GoldButton"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/format"

type ProductLite = {
  name: string
  slug: string
  sku?: string
  price?: number
  stock: number
  reserved: number
  lowStockThreshold?: number
  images?: { src?: string; type?: string }[]
}

type Summary = {
  orders: number
  products: number
  users: number
  revenue: number
  paidCount: number
  averageOrder: number
  weekRevenue: number
  pendingCount: number
  shippedCount: number
  reservedUnits: number
  onHand: number
  daily: { date: string; total: number; label: string }[]
  lowStock: ProductLite[]
  catalog: ProductLite[]
  recent: {
    _id: string
    orderNumber: string
    total: number
    status: string
    paymentStatus: string
    email: string
    name?: string
    createdAt?: string
    lines?: { name?: string; image?: string; quantity?: number }[]
  }[]
}

export default function AdminHome() {
  const { user } = useAuth()
  const [data, setData] = useState<Summary | null>(null)
  useEffect(() => {
    api<Summary>("/api/admin/summary").then(setData).catch(() => setData(null))
  }, [])

  const maxDay = Math.max(1, ...(data?.daily.map((d) => d.total) ?? [1]))
  const cards = [
    { label: "Revenue", value: formatINR(data?.revenue ?? 0), hint: `${formatINR(data?.weekRevenue ?? 0)} this week`, icon: IndianRupee },
    { label: "Paid orders", value: data?.paidCount ?? 0, hint: `${data?.pendingCount ?? 0} awaiting payment`, icon: ShoppingBag },
    { label: "Customers", value: data?.users ?? 0, hint: "Storefront accounts", icon: Users },
    { label: "Catalog", value: data?.products ?? 0, hint: `${data?.onHand ?? 0} units on hand`, icon: Package },
  ]

  return (
    <div>
      <AdminHeader
        eyebrow="Dashboard"
        title={`Hello${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="A live look at NOOR E DERMA — orders, stock, and the catalog from one desk."
        actions={
          <>
            <GoldButton variant="outline" className="px-4 py-2.5 text-[12px]" to="/">
              View shop <ArrowUpRight size={14} />
            </GoldButton>
            <GoldButton className="px-4 py-2.5 text-[12px]" to="/admin/products">
              Manage products
            </GoldButton>
          </>
        }
      />

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <AdminCard key={c.label} className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-[11px] tracking-[0.16em] text-ink/45 uppercase">{c.label}</p>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-sage-50 text-sage-800">
                  <Icon size={15} />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl">{c.value}</p>
              <p className="mt-1 text-[12px] text-ink/45">{c.hint}</p>
            </AdminCard>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminCard className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Last 7 days</p>
              <h2 className="mt-2 text-2xl">Revenue</h2>
            </div>
            <p className="text-sm font-medium">{formatINR(data?.weekRevenue ?? 0)}</p>
          </div>
          <div className="mt-6 flex h-36 items-end gap-2">
            {(data?.daily ?? []).map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-28 w-full items-end rounded-t-lg bg-sage-50">
                  <div
                    className="w-full rounded-t-lg gold-fill"
                    style={{ height: `${Math.max(6, Math.round((d.total / maxDay) * 100))}%` }}
                    title={formatINR(d.total)}
                  />
                </div>
                <span className="text-[10px] tracking-wide text-ink/45 uppercase">{d.label}</span>
              </div>
            ))}
            {!data?.daily.length ? <p className="text-sm text-ink/45">No paid orders this week yet.</p> : null}
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <p className="eyebrow">Operations</p>
          <h2 className="mt-2 text-2xl">At a glance</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/55">Average order</dt>
              <dd className="font-medium">{formatINR(data?.averageOrder ?? 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/55">Units reserved</dt>
              <dd className="font-medium">{data?.reservedUnits ?? 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/55">Shipped</dt>
              <dd className="font-medium">{data?.shippedCount ?? 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/55">All orders</dt>
              <dd className="font-medium">{data?.orders ?? 0}</dd>
            </div>
          </dl>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Link href="/admin/orders" className="rounded-2xl bg-sage-50 px-3 py-3 text-[12px] text-sage-800">
              Review orders
            </Link>
            <Link href="/admin/inventory" className="rounded-2xl bg-sage-50 px-3 py-3 text-[12px] text-sage-800">
              Adjust stock
            </Link>
          </div>
        </AdminCard>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-2xl">Catalog</h2>
          <Link href="/admin/products" className="text-[12px] text-sage-700 hover:underline">
            All products
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {(data?.catalog ?? []).map((p) => {
            const available = p.stock - p.reserved
            return (
              <AdminCard key={p.slug} className="overflow-hidden">
                <div className="flex h-28 items-center justify-center bg-peach">
                  {thumbSrc(p.images) ? (
                    <img src={thumbSrc(p.images)} alt={p.name} className="h-full w-full object-contain p-3" />
                  ) : (
                    <Package className="text-ink/25" />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-display text-lg leading-tight">{p.name}</p>
                  <p className="mt-1 text-[11px] tracking-wide text-ink/45 uppercase">{p.sku}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{formatINR(p.price ?? 0)}</span>
                    <StockBar available={available} stock={p.stock} threshold={p.lowStockThreshold} />
                  </div>
                </div>
              </AdminCard>
            )
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="flex items-center justify-between px-5 pt-5">
            <h2 className="text-2xl">Low stock</h2>
            <Link href="/admin/inventory" className="text-[12px] text-sage-700 hover:underline">
              Inventory
            </Link>
          </div>
          {data?.lowStock.length ? (
            <ul className="divide-y divide-sage-50 px-2 py-2">
              {data.lowStock.map((p) => (
                <li key={p.slug} className="flex items-center gap-3 px-3 py-3">
                  <Thumb src={thumbSrc(p.images)} alt={p.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-[12px] text-ink/45">{p.sku}</p>
                  </div>
                  <Pill tone="warn">{p.stock - p.reserved} left</Pill>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<CheckCircle2 size={22} />}
              title="All products are healthy"
              body="Nothing is under its low-stock threshold. Inventory will flag here when a ritual runs thin."
            />
          )}
        </AdminCard>

        <AdminCard>
          <div className="flex items-center justify-between px-5 pt-5">
            <h2 className="text-2xl">Recent orders</h2>
            <Link href="/admin/orders" className="text-[12px] text-sage-700 hover:underline">
              All orders
            </Link>
          </div>
          {data?.recent.length ? (
            <ul className="divide-y divide-sage-50 px-2 py-2">
              {data.recent.map((o) => (
                <li key={o._id} className="flex items-center gap-3 px-3 py-3">
                  <div className="flex -space-x-2">
                    {(o.lines ?? []).slice(0, 3).map((line, i) => (
                      <Thumb key={`${o._id}-${i}`} src={line.image} alt={line.name} size="sm" />
                    ))}
                    {!o.lines?.length ? <Thumb size="sm" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{o.orderNumber}</p>
                    <p className="truncate text-[12px] text-ink/45">{o.name || o.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatINR(o.total)}</p>
                    <Pill tone={statusTone(o.status)}>{prettyStatus(o.status)}</Pill>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<ShoppingBag size={22} />}
              title="Waiting for the first order"
              body="Paid checkouts will land here with customer, total, and line thumbnails."
              action={
                <GoldButton variant="outline" className="px-4 py-2 text-[12px]" to="/shop">
                  Open shop
                </GoldButton>
              }
            />
          )}
        </AdminCard>
      </div>
    </div>
  )
}
