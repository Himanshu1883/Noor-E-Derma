import { z } from "zod"
import { ApiError, json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { audit } from "@/lib/audit"
import { connectDb } from "@/lib/db"
import { Order } from "@/models/Order"
import { User } from "@/models/User"

const schema = z.object({
  status: z.enum(["active", "disabled"]).optional(),
  role: z.enum(["customer", "admin"]).optional(),
  name: z.string().min(2).max(80).optional(),
  phone: z.string().max(20).optional(),
})

export const GET = withHandler(async (_request, context) => {
  await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  await connectDb()
  const user = await User.findById(id).select("-passwordHash -failedLoginAttempts -lockedUntil").lean()
  if (!user) throw new ApiError(404, "User not found")
  const orders = await Order.find({ $or: [{ userId: user._id }, { email: user.email }] })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()
  return json({ user, orders })
})

export const DELETE = withHandler(async (_request, context) => {
  const admin = await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  if (id === String(admin._id)) throw new ApiError(400, "You cannot delete your own account")
  await connectDb()
  const user = await User.findById(id)
  if (!user) throw new ApiError(404, "User not found")
  if (user.role === "admin") throw new ApiError(400, "Remove admin access before deleting")
  await user.deleteOne()
  await audit({ actorId: String(admin._id), actorEmail: admin.email, action: "user.delete", entity: "user", entityId: id })
  return json({ ok: true })
})

export const PATCH = withHandler(async (request, context) => {
  const admin = await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  if (id === String(admin._id)) throw new ApiError(400, "Use another admin to change your own role or status")
  const body = schema.parse(await request.json())
  await connectDb()
  const user = await User.findByIdAndUpdate(id, body, { returnDocument: "after" }).select("-passwordHash")
  if (!user) throw new ApiError(404, "User not found")
  await audit({ actorId: String(admin._id), actorEmail: admin.email, action: "user.update", entity: "user", entityId: id, meta: body })
  return json({ user })
})
