import { z } from "zod"
import { ApiError, json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { Coupon } from "@/models/Coupon"

const schema = z.object({
  active: z.boolean().optional(),
})

export const PATCH = withHandler(async (request, context) => {
  await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  const body = schema.parse(await request.json())
  await connectDb()
  const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true })
  if (!coupon) throw new ApiError(404, "Coupon not found")
  return json({ coupon })
})
