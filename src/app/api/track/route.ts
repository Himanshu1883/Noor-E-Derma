import { ApiError, json, withHandler, clientIp } from "@/lib/api"
import { getSessionLite } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { serializeTrack } from "@/lib/commerce/tracking"
import { rateLimit } from "@/lib/rate-limit"
import { Order } from "@/models/Order"
import { z } from "zod"

const bodySchema = z.object({ orderId: z.string().min(4), phone: z.string().optional() })

export const POST = withHandler(async (request) => {
  rateLimit(`track:${clientIp(request)}`, 40, 15 * 60 * 1000)
  const body = bodySchema.parse(await request.json())
  const orderNumber = body.orderId.trim().toUpperCase()
  await connectDb()
  const [order, session] = await Promise.all([
    Order.findOne({ orderNumber }).lean(),
    getSessionLite(),
  ])
  if (!order) throw new ApiError(404, "No order matches that ID")
  const isOwner = Boolean(session && order.userId && String(order.userId) === session.id)
  const isAdmin = session?.role === "admin"
  const given = (body.phone ?? "").replace(/\D/g, "").slice(-10)
  const expected = String(order.phone ?? "").replace(/\D/g, "").slice(-10)
  const phoneMatch = given.length >= 8 && expected === given
  if (!isOwner && !isAdmin && !phoneMatch) {
    throw new ApiError(403, "Phone number does not match this order")
  }
  return json(serializeTrack(order as Parameters<typeof serializeTrack>[0]))
})
