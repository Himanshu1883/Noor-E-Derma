import { json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { Order } from "@/models/Order"

export const GET = withHandler(async (request) => {
  await requireAdmin()
  await connectDb()
  const url = new URL(request.url)
  const status = url.searchParams.get("status")
  const q = url.searchParams.get("q") ?? ""
  const filter: Record<string, unknown> = {}
  if (status) filter.status = status
  if (q) filter.$or = [{ orderNumber: new RegExp(q, "i") }, { email: new RegExp(q, "i") }, { phone: new RegExp(q, "i") }]
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100)
  return json({ orders })
})
