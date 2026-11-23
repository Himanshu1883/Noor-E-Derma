"use client"

import { Archive, Plus, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
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

type Product = {
  _id: string
  name: string
  slug: string
  sku: string
  price: number
  compareAt?: number
  stock: number
  reserved: number
  active: boolean
  tagline?: string
  images?: { src?: string; type?: string; alt?: string }[]
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(false)
  const load = () => api<{ products: Product[] }>("/api/admin/products").then((d) => setProducts(d.products))
  useEffect(() => {
    void load()
  }, [])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return products
    return products.filter((p) => [p.name, p.sku, p.slug].join(" ").toLowerCase().includes(needle))
  }, [products, q])

  const save = async (form: FormData) => {
    try {
      await api("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          slug: String(form.get("slug") || "")
            .toLowerCase()
            .replace(/\s+/g, "-"),
          sku: form.get("sku"),
          price: Number(form.get("price")),
          stock: Number(form.get("stock")),
          description: form.get("description") || "",
          images: form.get("image") ? [{ src: form.get("image"), alt: form.get("name") }] : [],
        }),
      })
      toast.success("Product created")
      setOpen(false)
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create product")
    }
  }

  return (
    <div>
      <AdminHeader
        eyebrow="Catalog"
        title="Products"
        description="Rituals, kits, and bundles with live stock. Images come from the product record — the same shots the shop uses."
        actions={
          <GoldButton className="px-4 py-2.5 text-[12px]" onClick={() => setOpen((v) => !v)}>
            <Plus size={14} /> {open ? "Close" : "Add product"}
          </GoldButton>
        }
      />

      {open ? (
        <form
          className="mt-6 grid gap-3 rounded-[24px] bg-white p-5 ring-1 ring-sage-100 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            void save(new FormData(e.currentTarget))
          }}
        >
          <input name="name" required placeholder="Name" className={fieldClass} />
          <input name="slug" required placeholder="slug" className={fieldClass} />
          <input name="sku" required placeholder="SKU" className={fieldClass} />
          <input name="price" type="number" required placeholder="Price (₹)" className={fieldClass} />
          <input name="stock" type="number" required placeholder="Opening stock" className={fieldClass} />
          <input name="image" placeholder="Image URL or /api/media/id" className={fieldClass} />
          <textarea name="description" placeholder="Description" className="md:col-span-2 min-h-24 rounded-2xl bg-ivory px-4 py-3 text-sm outline-none ring-1 ring-sage-100 focus:ring-gold/50" />
          <div className="md:col-span-2">
            <GoldButton type="submit">Save product</GoldButton>
          </div>
        </form>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink/50">{filtered.length} in catalog</p>
        <label className="relative w-full max-w-xs">
          <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-ink/35" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, SKU, slug" className={`${fieldClass} pl-9`} />
        </label>
      </div>

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
                  const available = p.stock - p.reserved
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
                        <Pill tone={p.active ? "good" : "bad"}>{p.active ? "Live" : "Archived"}</Pill>
                      </td>
                      <td className="pr-4">
                        {p.active ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-[12px] text-ink/45 hover:text-red-800"
                            onClick={async () => {
                              await api(`/api/admin/products/${p._id}`, { method: "DELETE" })
                              toast.success("Archived")
                              await load()
                            }}
                          >
                            <Archive size={12} /> Archive
                          </button>
                        ) : null}
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
    </div>
  )
}
