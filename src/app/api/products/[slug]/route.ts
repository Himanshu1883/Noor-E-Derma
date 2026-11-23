import { ApiError, json, withHandler } from "@/lib/api"
import { toStoreProduct } from "@/lib/catalog"
import { connectDb } from "@/lib/db"
import { Product } from "@/models/Product"

export const GET = withHandler(async (_request, context) => {
  const { slug } = (await (context as { params: Promise<{ slug: string }> }).params)
  await connectDb()
  const doc = await Product.findOne({ slug, active: true })
  if (!doc) throw new ApiError(404, "Product not found")
  return json({ product: toStoreProduct(doc) })
})
