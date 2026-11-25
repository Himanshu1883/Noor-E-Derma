"use client"

import { Warehouse } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  AdminBusy,
  AdminCard,
  AdminHeader,
  EmptyState,
  formatDateTime,
  Pill,
  StockBar,
  Thumb,
  thumbSrc,
} from "@/components/admin/ui"
import { GoldButton } from "@/components/GoldButton"
import { QuantityStepper } from "@/components/QuantityStepper"
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
  const [products, setProducts] = useState<Product[] | null>(null)
  const [logs, setLogs] = useState<Log[]>([])
  const [drafts, setDrafts] = useState<Record<string, number>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [pending, setPending] = useState<string | null>(null)
  const load = () =>
    api<{ products: Product[]; logs: Log[] }>("/api/admin/inventory").then((d) => {
      setProducts(d.products)
      setLogs(d.logs ?? [])
    })
  useEffect(() => {
    void load()
  }, [])

  const setDraft = (id: string, stock: number, current: number) => {
    const next = Math.max(0, Math.min(99999, Math.round(stock)))
    setDrafts((map) => {
      if (next === current) {
        const copy = { ...map }
        delete copy[id]
        return copy
      }
      return { ...map, [id]: next }
    })
  }

  const save = async (product: Product) => {
    const next = drafts[product._id]
    if (next == null || next === product.stock || pending) return
    const quantity = next - product.stock
    setPending(product._id)
    try {
      await api("/api/admin/inventory", {
        method: "POST",
        body: JSON.stringify({
          productId: product._id,
          quantity,
          note: notes[product._id]?.trim() || "Dashboard restock",
        }),
      })
      setProducts((list) => (list ?? []).map((row) => (row._id === product._id ? { ...row, stock: next } : row)))
      setDrafts((map) => {
        const copy = { ...map }
        delete copy[product._id]
        return copy
      })
      toast.success(`${product.name} is now ${next} on hand`)
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save stock")
    } finally {
      setPending(null)
    }
  }

  const byId = new Map((products ?? []).map((p) => [p._id, p]))
  const dirtyCount = Object.keys(drafts).length
  const low = (products ?? []).filter((p) => p.stock - p.reserved <= p.lowStockThreshold).length

  const dirtyIds = useMemo(() => Object.keys(drafts), [drafts])

  return (
    <div>
      <AdminHeader
        eyebrow="Warehouse"
        title="Inventory"
        description="Set the new on-hand number with plus and minus, then save. Nothing is written until you confirm."
        actions={
          dirtyCount ? (
            <p className="rounded-full bg-amber-50 px-3 py-1.5 text-[12px] text-amber-900">{dirtyCount} unsaved</p>
          ) : null
        }
      />

      {products == null ? (
        <AdminBusy label="Loading inventory" />
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <AdminCard className="p-4">
              <p className="text-[12px] font-semibold tracking-[0.12em] text-ink/80 uppercase">SKUs</p>
              <p className="mt-1 font-display text-3xl">{products.length}</p>
            </AdminCard>
            <AdminCard className="p-4">
              <p className="text-[12px] font-semibold tracking-[0.12em] text-ink/80 uppercase">On hand</p>
              <p className="mt-1 font-display text-3xl">{products.reduce((s, p) => s + p.stock, 0)}</p>
            </AdminCard>
            <AdminCard className="p-4">
              <p className="text-[12px] font-semibold tracking-[0.12em] text-ink/80 uppercase">Low stock</p>
              <p className="mt-1 font-display text-3xl">{low}</p>
            </AdminCard>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <ul className="space-y-3">
              {products.map((p) => {
                const available = p.stock - p.reserved
                const isLow = available <= p.lowStockThreshold
                const draft = drafts[p._id] ?? p.stock
                const dirty = draft !== p.stock
                const busy = pending === p._id
                const delta = draft - p.stock
                return (
                  <li key={p._id}>
                    <AdminCard className={`p-4 ${dirty ? "ring-sage-300" : isLow ? "ring-amber-300" : ""}`}>
                      <div className="flex flex-wrap items-center gap-4">
                        <Thumb src={thumbSrc(p.images)} alt={p.name} size="lg" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-display text-xl leading-tight">{p.name}</p>
                            {isLow ? <Pill tone="warn">Low</Pill> : <Pill tone="good">Healthy</Pill>}
                          </div>
                          <p className="mt-1 text-[12px] tracking-wide text-ink/45 uppercase">{p.sku}</p>
                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-ink/55">
                            <span>On hand {p.stock}</span>
                            <span>Available {available}</span>
                            <span>Reserved {p.reserved}</span>
                          </div>
                          <div className="mt-2 max-w-xs">
                            <StockBar available={available} stock={p.stock} threshold={p.lowStockThreshold} />
                          </div>
                        </div>
                        <div className="flex min-w-[220px] flex-col items-end gap-2">
                          <QuantityStepper value={draft} min={0} max={99999} onChange={(next) => setDraft(p._id, next, p.stock)} />
                          {dirty ? (
                            <p className="text-[12px] text-sage-800">
                              {p.stock} → {draft}{" "}
                              <span className="text-ink/45">
                                ({delta > 0 ? "+" : ""}
                                {delta})
                              </span>
                            </p>
                          ) : (
                            <p className="text-[11px] text-ink/60">Adjust, then save</p>
                          )}
                        </div>
                      </div>
                      {dirty ? (
                        <div className="mt-3 flex items-center gap-2 border-t border-sage-50 pt-2.5">
                          <input
                            value={notes[p._id] ?? ""}
                            onChange={(e) => setNotes((map) => ({ ...map, [p._id]: e.target.value }))}
                            placeholder="Note (optional)"
                            className="h-8 min-w-0 flex-1 rounded-full bg-ivory px-3 text-[12px] outline-none ring-1 ring-sage-100"
                          />
                          <button
                            type="button"
                            className="h-8 shrink-0 px-2 text-[11px] text-ink/60 hover:text-ink"
                            onClick={() => setDraft(p._id, p.stock, p.stock)}
                          >
                            Discard
                          </button>
                          <GoldButton size="sm" loading={busy} onClick={() => void save(p)}>
                            {busy ? "Saving" : "Save"}
                          </GoldButton>
                        </div>
                      ) : null}
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
              {dirtyIds.length ? (
                <p className="mt-1 text-[12px] text-ink/45">Unsaved counts stay on the left until you press Save stock.</p>
              ) : null}
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
        </>
      )}
    </div>
  )
}
