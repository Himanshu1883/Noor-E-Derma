import mongoose from "mongoose"
import { ApiError, json, withHandler } from "@/lib/api"
import { getSessionUser } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { Order } from "@/models/Order"

export const GET = withHandler(async (request, context) => {
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  const url = new URL(request.url)
  const phone = url.searchParams.get("phone") ?? ""
  await connectDb()
  const filter = mongoose.Types.ObjectId.isValid(id) ? { $or: [{ orderNumber: id }, { _id: id }] } : { orderNumber: id }
  const order = await Order.findOne(filter)
  if (!order) throw new ApiError(404, "Order not found")
  const user = await getSessionUser()
  const isOwner = user && String(order.userId) === String(user._id)
  const isAdmin = user?.role === "admin"
  const phoneMatch = phone && order.phone.replace(/\s/g, "").endsWith(phone.replace(/\s/g, "").slice(-10))
  if (!isOwner && !isAdmin && !phoneMatch) throw new ApiError(403, "Enter the checkout phone number to view this order")
  return json({ order })
})
