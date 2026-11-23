import { dailyDetox, getCatalog, glowDuo, tanEraser, tanEraserKit, type Product } from "@/data/products"

export type Collection = {
  slug: string
  title: string
  accent: string
  eyebrow: string
  intro: string
  ids: string[]
}

export const collections: Collection[] = [
  {
    slug: "tan",
    title: "Tan",
    accent: "care",
    eyebrow: "Collection",
    intro: "Treatments for sun-tanned and dull-looking skin, built around Tan Eraser’s 20-minute ritual.",
    ids: [tanEraser.id, tanEraserKit.id, glowDuo.id],
  },
  {
    slug: "detox",
    title: "Daily",
    accent: "detox",
    eyebrow: "Collection",
    intro: "The everyday cleanse: Daily Detox Face Wash with niacinamide, vitamin E, BHA and aloe vera.",
    ids: [dailyDetox.id, glowDuo.id],
  },
  {
    slug: "combos",
    title: "Value",
    accent: "combos",
    eyebrow: "Offers",
    intro: "Pair the ritual and save. The Glow Duo is Tan Eraser + Daily Detox, together for less.",
    ids: [glowDuo.id, tanEraserKit.id],
  },
]

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug)
}

export function productsFor(collection?: Collection): Product[] {
  const catalog = getCatalog()
  if (!collection) return catalog
  return collection.ids
    .map((id) => catalog.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
}
