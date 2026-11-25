import { z } from "zod"
import { ApiError, json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { Coupon } from "@/models/Coupon"

const schema = z.object({
  code: z.string().trim().min(3).max(24).optional(),
  type: z.enum(["percent", "fixed"]).optional(),
  value: z.number().positive().optional(),
  minSubtotal: z.number().min(0).optional(),
  maxUses: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
  expiresAt: z.string().optional().nullable(),
})

export const PATCH = withHandler(async (request, context) => {
  await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  const body = schema.parse(await request.json())
  await connectDb()
  const coupon = await Coupon.findByIdAndUpdate(
    id,
    {
      ...body,
      ...(body.code ? { code: body.code.toUpperCase() } : {}),
      ...(body.expiresAt === null ? { expiresAt: undefined } : body.expiresAt ? { expiresAt: new Date(body.expiresAt) } : {}),
    },
    { returnDocument: "after" },
  )
  if (!coupon) throw new ApiError(404, "Coupon not found")
  return json({ coupon })
})

export const DELETE = withHandler(async (_request, context) => {
  await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  await connectDb()
  const coupon = await Coupon.findByIdAndDelete(id)
  if (!coupon) throw new ApiError(404, "Coupon not found")
  return json({ ok: true })
})
