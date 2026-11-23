import type { Product as StoreProduct } from "@/data/products"
import { getCatalog } from "@/data/products"
import { connectDb, dbReady } from "@/lib/db"
import { Product, type ProductDoc } from "@/models/Product"

export function availableStock(doc: Pick<ProductDoc, "stock" | "reserved">) {
  return Math.max(0, (doc.stock ?? 0) - (doc.reserved ?? 0))
}

export function toStoreProduct(doc: ProductDoc): StoreProduct & { stock: number; sku: string; lowStock: boolean } {
  return {
    id: doc.slug,
    slug: doc.slug,
    name: doc.name,
    displayName: doc.displayName || doc.name,
    tagline: doc.tagline,
    description: doc.description,
    price: doc.price,
    compareAt: doc.compareAt || undefined,
    netWeight: doc.netWeight || undefined,
    rating: doc.rating ?? 0,
    reviewCount: doc.reviewCount ?? 0,
    images: (doc.images ?? []).map((img) => ({
      src: img.src,
      alt: img.alt ?? "",
      position: img.position ?? undefined,
      scale: img.scale ?? undefined,
      type: img.type === "video" ? "video" : "image",
      poster: img.poster ?? undefined,
    })),
    benefits: (doc.benefits ?? []).map((b) => ({
      label: b.label ?? "",
      detail: b.detail ?? "",
      icon: (b.icon as StoreProduct["benefits"][number]["icon"]) || "sparkles",
    })),
    actives: (doc.actives ?? []).map((a) => ({ name: a.name ?? "", note: a.note ?? "", percent: a.percent ?? undefined })),
    howToUse: (doc.howToUse ?? []).map((s) => ({ step: s.step ?? 0, title: s.title ?? "", body: s.body ?? "" })),
    faqs: (doc.faqs ?? []).map((f) => ({ q: f.q ?? "", a: f.a ?? "" })),
    badges: doc.badges ?? [],
    hasDetailPage: doc.hasDetailPage !== false,
    kitIncludes: doc.kitIncludes?.length ? doc.kitIncludes : undefined,
    isBundle: doc.isBundle || undefined,
    bundleOf: doc.bundleOf?.length ? doc.bundleOf : undefined,
    ctaLabel: doc.ctaLabel || undefined,
    cardLine: doc.cardLine || undefined,
    stock: availableStock(doc),
    sku: doc.sku,
    lowStock: availableStock(doc) <= (doc.lowStockThreshold ?? 8),
  }
}

export async function listLiveProducts() {
  if (!dbReady()) return getCatalog().map((p) => ({ ...p, stock: 50, sku: p.id.toUpperCase(), lowStock: false }))
  await connectDb()
  const docs = await Product.find({ active: true }).sort({ createdAt: 1 })
  if (!docs.length) return getCatalog().map((p) => ({ ...p, stock: 50, sku: p.id.toUpperCase(), lowStock: false }))
  return docs.map(toStoreProduct)
}

export async function findLiveProduct(slug: string) {
  const all = await listLiveProducts()
  return all.find((p) => p.slug === slug)
}
