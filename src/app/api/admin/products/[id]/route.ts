import { ApiError, json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { audit } from "@/lib/audit"
import { connectDb } from "@/lib/db"
import { oid } from "@/lib/commerce/inventory"
import { productInputSchema } from "@/lib/validators"
import { Product } from "@/models/Product"

function serializeProduct(product: { toObject: () => Record<string, unknown>; _id: { toString(): string } }) {
  return { ...product.toObject(), _id: String(product._id) }
}

async function findAdminProduct(key: string) {
  if (/^[a-f0-9]{24}$/i.test(key)) {
    const byId = await Product.findById(key)
    if (byId) return byId
  }
  const slug = key.toLowerCase()
  const sku = key.toUpperCase().replace(/-/g, "")
  return Product.findOne({ $or: [{ slug }, { sku }, { sku: key.toUpperCase() }] })
}

export const GET = withHandler(async (_request, context) => {
  await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  const key = id.trim()
  if (!key) throw new ApiError(400, "Missing product")
  await connectDb()
  const product = await findAdminProduct(key)
  if (!product) throw new ApiError(404, "Product not found")
  return json({ product: serializeProduct(product) })
})

export const PATCH = withHandler(async (request, context) => {
  const admin = await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  const raw = await request.json().catch(() => null)
  if (raw == null || typeof raw !== "object") throw new ApiError(400, "Invalid JSON body")
  const parsed = productInputSchema.partial().parse(raw)
  const body = Object.fromEntries(Object.entries(parsed).filter(([key]) => Object.hasOwn(raw, key)))
  await connectDb()
  const product = await Product.findByIdAndUpdate(oid(id), body, { returnDocument: "after" })
  if (!product) throw new ApiError(404, "Product not found")
  await audit({ actorId: String(admin._id), actorEmail: admin.email, action: "product.update", entity: "product", entityId: id })
  return json({ product: serializeProduct(product) })
})

export const DELETE = withHandler(async (_request, context) => {
  const admin = await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  await connectDb()
  const product = await Product.findByIdAndDelete(oid(id))
  if (!product) throw new ApiError(404, "Product not found")
  await audit({ actorId: String(admin._id), actorEmail: admin.email, action: "product.delete", entity: "product", entityId: id })
  return json({ ok: true })
})
