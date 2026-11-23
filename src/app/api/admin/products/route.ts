import { json, parseJson, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { audit } from "@/lib/audit"
import { connectDb } from "@/lib/db"
import { productInputSchema } from "@/lib/validators"
import { Product } from "@/models/Product"

export const GET = withHandler(async (request) => {
  const admin = await requireAdmin()
  void admin
  await connectDb()
  const q = new URL(request.url).searchParams.get("q") ?? ""
  const filter = q ? { $or: [{ name: new RegExp(q, "i") }, { sku: new RegExp(q, "i") }, { slug: new RegExp(q, "i") }] } : {}
  const products = await Product.find(filter).sort({ updatedAt: -1 })
  return json({ products })
})

export const POST = withHandler(async (request) => {
  const admin = await requireAdmin()
  const body = await parseJson(request, productInputSchema)
  await connectDb()
  const product = await Product.create({ ...body, reserved: 0 })
  await audit({ actorId: String(admin._id), actorEmail: admin.email, action: "product.create", entity: "product", entityId: String(product._id) })
  return json({ product }, 201)
})
