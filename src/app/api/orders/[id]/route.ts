import mongoose from "mongoose"
import { ApiError, json, withHandler } from "@/lib/api"
import { getSessionLite } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { serializeTrack } from "@/lib/commerce/tracking"
import { Order } from "@/models/Order"

export const GET = withHandler(async (request, context) => {
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  const phone = new URL(request.url).searchParams.get("phone") ?? ""
  await connectDb()
  const filter = mongoose.Types.ObjectId.isValid(id) ? { $or: [{ orderNumber: id }, { _id: id }] } : { orderNumber: id }
  const [order, session] = await Promise.all([Order.findOne(filter).lean(), getSessionLite()])
  if (!order) throw new ApiError(404, "Order not found")
  const isOwner = Boolean(session && order.userId && String(order.userId) === session.id)
  const isAdmin = session?.role === "admin"
  const phoneMatch = phone && String(order.phone).replace(/\s/g, "").endsWith(phone.replace(/\s/g, "").slice(-10))
  if (!isOwner && !isAdmin && !phoneMatch) throw new ApiError(403, "Enter the checkout phone number to view this order")
  const track = serializeTrack(order as Parameters<typeof serializeTrack>[0])
  return json({ order, track })
})
