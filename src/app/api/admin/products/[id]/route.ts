import { ApiError, json, parseJson, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { audit } from "@/lib/audit"
import { connectDb } from "@/lib/db"
import { oid } from "@/lib/commerce/inventory"
import { productInputSchema } from "@/lib/validators"
import { Product } from "@/models/Product"

export const PATCH = withHandler(async (request, context) => {
  const admin = await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  const body = await parseJson(request, productInputSchema.partial())
  await connectDb()
  const product = await Product.findByIdAndUpdate(oid(id), body, { new: true })
  if (!product) throw new ApiError(404, "Product not found")
  await audit({ actorId: String(admin._id), actorEmail: admin.email, action: "product.update", entity: "product", entityId: id })
  return json({ product })
})

export const DELETE = withHandler(async (_request, context) => {
  const admin = await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  await connectDb()
  const product = await Product.findByIdAndUpdate(oid(id), { active: false }, { new: true })
  if (!product) throw new ApiError(404, "Product not found")
  await audit({ actorId: String(admin._id), actorEmail: admin.email, action: "product.archive", entity: "product", entityId: id })
  return json({ product })
})
