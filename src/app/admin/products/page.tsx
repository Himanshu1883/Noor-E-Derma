"use client"

import { Archive, Pencil, Plus, RotateCcw, Search, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { ProductForm, type AdminProduct } from "@/components/admin/ProductForm"
import {
  AdminBusy,
  AdminCard,
  AdminHeader,
  EmptyState,
  fieldClass,
  Pill,
  StockBar,
  Thumb,
  thumbSrc,
} from "@/components/admin/ui"
import { GoldButton } from "@/components/GoldButton"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/format"

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[] | null>(null)
  const [q, setQ] = useState("")
  const [editing, setEditing] = useState<AdminProduct | null>(null)
  const [creating, setCreating] = useState(false)
  const load = () => api<{ products: AdminProduct[] }>("/api/admin/products").then((d) => setProducts(d.products))
  useEffect(() => {
    void load()
  }, [])

  const filtered = useMemo(() => {
    const list = products ?? []
    const needle = q.trim().toLowerCase()
    if (!needle) return list
    return list.filter((p) => [p.name, p.sku, p.slug].join(" ").toLowerCase().includes(needle))
  }, [products, q])

  const closeForm = () => {
    setCreating(false)
    setEditing(null)
  }

  return (
    <div>
      <AdminHeader
        eyebrow="Catalog"
        title="Products"
        description="Create and edit rituals with gallery, cover image, and extra fields. The shop uses the front photo first."
        actions={
          <GoldButton
            className="px-4 py-2.5 text-[12px]"
            onClick={() => {
              setEditing(null)
              setCreating((v) => !v)
            }}
          >
            <Plus size={14} /> {creating && !editing ? "Close" : "Add product"}
          </GoldButton>
        }
      />

      {creating || editing ? (
        <ProductForm
          key={editing?._id ?? "new"}
          product={editing}
          onCancel={closeForm}
          onSaved={async () => {
            closeForm()
            await load()
          }}
        />
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink/50">{filtered.length} in catalog</p>
        <label className="relative w-full max-w-xs">
          <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-ink/35" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, SKU, slug" className={`${fieldClass} pl-9`} />
        </label>
      </div>

      {products == null ? (
        <AdminBusy label="Loading products" />
      ) : (
        <AdminCard className="mt-4 overflow-hidden">
          {filtered.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-sage-50/60 text-[11px] tracking-[0.16em] text-ink/45 uppercase">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="font-medium">SKU</th>
                    <th className="font-medium">Price</th>
                    <th className="font-medium">Stock</th>
                    <th className="font-medium">Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const available = (p.stock ?? 0) - ((p as AdminProduct & { reserved?: number }).reserved ?? 0)
                    return (
                      <tr key={p._id} className="border-t border-sage-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Thumb src={thumbSrc(p.images)} alt={p.name} size="lg" />
                            <div>
                              <p className="font-medium">{p.name}</p>
                              <p className="text-[12px] text-ink/45">{p.tagline || p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-[12px] tracking-wide text-ink/60 uppercase">{p.sku}</td>
                        <td>
                          <p className="font-medium">{formatINR(p.price)}</p>
                          {p.compareAt ? <p className="text-[11px] text-ink/40 line-through">{formatINR(p.compareAt)}</p> : null}
                        </td>
                        <td>
                          <StockBar available={available} stock={p.stock} />
                          {available <= 8 ? <p className="text-[11px] text-red-700">Low</p> : null}
                        </td>
                        <td>
                          <Pill tone={p.active !== false ? "good" : "bad"}>{p.active !== false ? "Live" : "Archived"}</Pill>
                        </td>
                        <td className="pr-4">
                          <div className="flex flex-wrap items-center justify-end gap-3">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 text-[12px] text-sage-700 hover:underline"
                              onClick={() => {
                                setCreating(false)
                                setEditing(p)
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }}
                            >
                              <Pencil size={12} /> Edit
                            </button>
                            {p.active !== false ? (
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 text-[12px] text-ink/45 hover:text-ink"
                                onClick={async () => {
                                  await api(`/api/admin/products/${p._id}`, { method: "PATCH", body: JSON.stringify({ active: false }) })
                                  toast.success("Archived")
                                  await load()
                                }}
                              >
                                <Archive size={12} /> Archive
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 text-[12px] text-sage-700 hover:underline"
                                onClick={async () => {
                                  await api(`/api/admin/products/${p._id}`, { method: "PATCH", body: JSON.stringify({ active: true }) })
                                  toast.success("Restored")
                                  await load()
                                }}
                              >
                                <RotateCcw size={12} /> Restore
                              </button>
                            )}
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 text-[12px] text-red-700 hover:underline"
                              onClick={async () => {
                                if (!confirm(`Delete ${p.name}? This cannot be undone.`)) return
                                await api(`/api/admin/products/${p._id}`, { method: "DELETE" })
                                toast.success("Deleted")
                                await load()
                              }}
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState icon={<Search size={22} />} title="No products match" body="Try another search, or add a ritual to the catalog." />
          )}
        </AdminCard>
      )}
    </div>
  )
}
