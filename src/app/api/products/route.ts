import { json, withHandler } from "@/lib/api"
import { availableStock, toStoreProduct } from "@/lib/catalog"
import { connectDb } from "@/lib/db"
import { Category } from "@/models/Category"
import { Product } from "@/models/Product"

export const GET = withHandler(async (request) => {
  await connectDb()
  const url = new URL(request.url)
  const q = url.searchParams.get("q")?.trim() ?? ""
  const collection = url.searchParams.get("collection") ?? ""
  const sort = url.searchParams.get("sort") ?? "featured"
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"))
  const limit = Math.min(48, Math.max(1, Number(url.searchParams.get("limit") || "24")))
  const filter: Record<string, unknown> = { active: true }
  if (q) filter.$text = { $search: q }
  if (collection) {
    const cat = await Category.findOne({ slug: collection })
    if (cat?.productSlugs?.length) filter.slug = { $in: cat.productSlugs }
    else filter.categorySlugs = collection
  }
  let query = Product.find(filter)
  if (sort === "az") query = query.sort({ name: 1 })
  else if (sort === "za") query = query.sort({ name: -1 })
  else if (sort === "price-asc") query = query.sort({ price: 1 })
  else if (sort === "price-desc") query = query.sort({ price: -1 })
  else query = query.sort({ createdAt: 1 })
  const total = await Product.countDocuments(filter)
  const docs = await query.skip((page - 1) * limit).limit(limit)
  return json({
    products: docs.map(toStoreProduct),
    total,
    page,
    pages: Math.ceil(total / limit),
  })
})

export { availableStock }
