import type { Product } from "@/data/products"

export type ShopSort = "featured" | "az" | "za" | "price-asc" | "price-desc"

export const SORT_OPTIONS: { id: ShopSort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "az", label: "A – Z" },
  { id: "za", label: "Z – A" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
]

export function sortProducts(products: Product[], sort: ShopSort): Product[] {
  const next = [...products]
  switch (sort) {
    case "az":
      next.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "za":
      next.sort((a, b) => b.name.localeCompare(a.name))
      break
    case "price-asc":
      next.sort((a, b) => a.price - b.price)
      break
    case "price-desc":
      next.sort((a, b) => b.price - a.price)
      break
    default:
      break
  }
  return next
}
