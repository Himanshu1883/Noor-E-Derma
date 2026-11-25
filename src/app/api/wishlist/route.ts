import mongoose from "mongoose"
import { z } from "zod"
import { json, parseJson, withHandler } from "@/lib/api"
import { requireUser } from "@/lib/auth/session"
import { toStoreProduct } from "@/lib/catalog"
import { connectDb } from "@/lib/db"
import { Product } from "@/models/Product"
import { Wishlist } from "@/models/Wishlist"

function findProduct(idOrSlug: string) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug) && String(new mongoose.Types.ObjectId(idOrSlug)) === idOrSlug) {
    return Product.findById(idOrSlug)
  }
  return Product.findOne({ slug: idOrSlug })
}

export const GET = withHandler(async () => {
  const user = await requireUser()
  await connectDb()
  const list = await Wishlist.findOne({ userId: user._id })
  const products = await Product.find({ _id: { $in: list?.productIds ?? [] }, active: true })
  const mapped = products.map(toStoreProduct)
  return json({
    products: mapped,
    keys: mapped.flatMap((p) => [p.slug, p.id, p._id].filter(Boolean)),
  })
})

export const POST = withHandler(async (request) => {
  const user = await requireUser()
  const body = await parseJson(
    request,
    z.object({
      productId: z.string().min(1),
      wished: z.boolean().optional(),
    }),
  )
  await connectDb()
  const product = await findProduct(body.productId)
  if (!product) return json({ error: "Product not found" }, 404)
  const list = (await Wishlist.findOne({ userId: user._id })) ?? (await Wishlist.create({ userId: user._id, productIds: [] }))
  const id = String(product._id)
  const has = list.productIds.some((p) => String(p) === id)
  const next = body.wished ?? !has
  if (next !== has) {
    list.productIds = next ? [...list.productIds, product._id] : list.productIds.filter((p) => String(p) !== id)
    await list.save()
  }
  return json({ wished: next, slug: product.slug, id })
})
