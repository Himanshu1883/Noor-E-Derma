import { json, parseJson, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { couponSchema } from "@/lib/validators"
import { Coupon } from "@/models/Coupon"

export const GET = withHandler(async () => {
  await requireAdmin()
  await connectDb()
  return json({ coupons: await Coupon.find().sort({ createdAt: -1 }).lean() })
})

export const POST = withHandler(async (request) => {
  await requireAdmin()
  const body = await parseJson(request, couponSchema)
  await connectDb()
  const coupon = await Coupon.create({
    ...body,
    code: body.code.toUpperCase(),
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
  })
  return json({ coupon }, 201)
})
