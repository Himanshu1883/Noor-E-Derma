"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Warehouse } from "lucide-react"
import {
  AdminCard,
  AdminHeader,
  EmptyState,
  fieldClass,
  formatDateTime,
  Pill,
  StockBar,
  Thumb,
  thumbSrc,
} from "@/components/admin/ui"
import { api } from "@/lib/client"

type Product = {
  _id: string
  name: string
  slug: string
  sku: string
  stock: number
  reserved: number
  lowStockThreshold: number
  images?: { src?: string; type?: string }[]
}

type Log = {
  _id: string
  productId: string
  type: string
  quantity: number
  note?: string
  createdAt: string
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const load = () =>
    api<{ products: Product[]; logs: Log[] }>("/api/admin/inventory").then((d) => {
      setProducts(d.products)
      setLogs(d.logs ?? [])
    })
  useEffect(() => {
    void load()
  }, [])

  const byId = new Map(products.map((p) => [p._id, p]))
  const low = products.filter((p) => p.stock - p.reserved <= p.lowStockThreshold).length

  return (
    <div>
      <AdminHeader
        eyebrow="Warehouse"
        title="Inventory"
        description="On-hand units, checkout holds, and restocks. Each row shows the pack shot so you can spot the ritual at a glance."
      />

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <AdminCard className="p-4">
          <p className="text-[11px] tracking-[0.16em] text-ink/45 uppercase">SKUs</p>
          <p className="mt-1 font-display text-3xl">{products.length}</p>
        </AdminCard>
        <AdminCard className="p-4">
          <p className="text-[11px] tracking-[0.16em] text-ink/45 uppercase">On hand</p>
          <p className="mt-1 font-display text-3xl">{products.reduce((s, p) => s + p.stock, 0)}</p>
        </AdminCard>
        <AdminCard className="p-4">
          <p className="text-[11px] tracking-[0.16em] text-ink/45 uppercase">Low stock</p>
          <p className="mt-1 font-display text-3xl">{low}</p>
        </AdminCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <ul className="space-y-3">
          {products.map((p) => {
            const available = p.stock - p.reserved
            const isLow = available <= p.lowStockThreshold
            return (
              <li key={p._id}>
                <AdminCard className={`p-4 ${isLow ? "ring-amber-300" : ""}`}>
                  <div className="flex flex-wrap items-center gap-4">
                    <Thumb src={thumbSrc(p.images)} alt={p.name} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display text-xl leading-tight">{p.name}</p>
                        {isLow ? <Pill tone="warn">Low</Pill> : <Pill tone="good">Healthy</Pill>}
                      </div>
                      <p className="mt-1 text-[12px] tracking-wide text-ink/45 uppercase">{p.sku}</p>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-ink/55">
                        <span>Available {available}</span>
                        <span>On hand {p.stock}</span>
                        <span>Reserved {p.reserved}</span>
                      </div>
                      <div className="mt-2 max-w-xs">
                        <StockBar available={available} stock={p.stock} threshold={p.lowStockThreshold} />
                      </div>
                    </div>
                    <form
                      className="flex gap-2"
                      onSubmit={async (e) => {
                        e.preventDefault()
                        const form = e.currentTarget
                        const qty = Number(new FormData(form).get("qty"))
                        try {
                          await api("/api/admin/inventory", {
                            method: "POST",
                            body: JSON.stringify({ productId: p._id, quantity: qty, note: "Dashboard restock" }),
                          })
                          toast.success("Stock updated")
                          await load()
                          form.reset()
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : "Failed")
                        }
                      }}
                    >
                      <input name="qty" type="number" required placeholder="+10 or -2" className={`${fieldClass} w-28`} />
                      <button type="submit" className="rounded-full bg-sage-800 px-4 py-2 text-[12px] text-white">
                        Adjust
                      </button>
                    </form>
                  </div>
                </AdminCard>
              </li>
            )
          })}
          {!products.length ? (
            <AdminCard>
              <EmptyState icon={<Warehouse size={22} />} title="No inventory yet" body="Products appear here once they are in the catalog." />
            </AdminCard>
          ) : null}
        </ul>

        <AdminCard className="h-fit p-5">
          <h2 className="text-2xl">Recent movement</h2>
          <ul className="mt-4 space-y-3">
            {logs.slice(0, 12).map((log) => {
              const product = byId.get(String(log.productId))
              return (
                <li key={log._id} className="flex gap-3">
                  <Thumb src={thumbSrc(product?.images)} alt={product?.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm">{product?.name || "Product"}</p>
                    <p className="text-[12px] text-ink/50">
                      {log.type} · {log.quantity > 0 ? "+" : ""}
                      {log.quantity}
                      {log.note ? ` · ${log.note}` : ""}
                    </p>
                    <p className="text-[11px] text-ink/35">{formatDateTime(log.createdAt)}</p>
                  </div>
                </li>
              )
            })}
            {!logs.length ? <li className="text-sm text-ink/45">Adjustments and sales will list here.</li> : null}
          </ul>
        </AdminCard>
      </div>
    </div>
  )
}
