import { json, parseJson, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { audit } from "@/lib/audit"
import { restock } from "@/lib/commerce/inventory"
import { connectDb } from "@/lib/db"
import { inventoryAdjustSchema } from "@/lib/validators"
import { InventoryLog } from "@/models/InventoryLog"
import { Product } from "@/models/Product"

export const GET = withHandler(async () => {
  await requireAdmin()
  await connectDb()
  const products = await Product.find().sort({ name: 1 })
  const logs = await InventoryLog.find().sort({ createdAt: -1 }).limit(40)
  return json({ products, logs })
})

export const POST = withHandler(async (request) => {
  const admin = await requireAdmin()
  const body = await parseJson(request, inventoryAdjustSchema)
  const product = await restock(body.productId, body.quantity, String(admin._id), body.note || "Manual adjustment")
  await audit({
    actorId: String(admin._id),
    actorEmail: admin.email,
    action: "inventory.adjust",
    entity: "product",
    entityId: body.productId,
    meta: { quantity: body.quantity },
  })
  return json({ product })
})
