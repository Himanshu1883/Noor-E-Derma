import { json, withHandler } from "@/lib/api"
import { requireUser } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { Order } from "@/models/Order"

export const GET = withHandler(async () => {
  const user = await requireUser()
  await connectDb()
  const orders = await Order.find({ userId: user._id })
    .select("orderNumber status paymentStatus total createdAt trackingNumber lines.name lines.image lines.quantity")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()
  return json({ orders })
})
