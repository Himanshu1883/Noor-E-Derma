import { ApiError, json, withHandler } from "@/lib/api"
import { connectDb } from "@/lib/db"
import { rateLimit } from "@/lib/rate-limit"
import { clientIp } from "@/lib/api"
import { Order } from "@/models/Order"
import { z } from "zod"

export const POST = withHandler(async (request) => {
  rateLimit(`track:${clientIp(request)}`, 20, 15 * 60 * 1000)
  const body = z.object({ orderId: z.string().min(4), phone: z.string().min(8) }).parse(await request.json())
  await connectDb()
  const order = await Order.findOne({ orderNumber: body.orderId.trim().toUpperCase() })
  if (!order) throw new ApiError(404, "No order matches that ID")
  const expected = order.phone.replace(/\D/g, "").slice(-10)
  const given = body.phone.replace(/\D/g, "").slice(-10)
  if (expected !== given) throw new ApiError(403, "Phone number does not match this order")
  return json({
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    trackingNumber: order.trackingNumber,
    carrier: order.carrier,
    trackingUrl: order.trackingUrl,
    total: order.total,
    createdAt: order.createdAt,
    lines: order.lines,
  })
})
