import { connectDb } from "@/lib/db"
import { Coupon } from "@/models/Coupon"
import { Order } from "@/models/Order"
import { Settings } from "@/models/Settings"

export async function getSettings() {
  await connectDb()
  const existing = await Settings.findOne({ key: "default" })
  if (existing) return existing
  return Settings.create({ key: "default" })
}

export async function applyCoupon(code: string | undefined, subtotal: number, userId?: string) {
  if (!code) return { discount: 0, code: "" }
  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), active: true })
  if (!coupon) return { discount: 0, code: "" }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { discount: 0, code: "" }
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return { discount: 0, code: "" }
  if (subtotal < coupon.minSubtotal) return { discount: 0, code: "" }
  if (coupon.firstOrderOnly && userId) {
    const prior = await Order.countDocuments({ userId, paymentStatus: "paid" })
    if (prior > 0) return { discount: 0, code: "" }
  }
  const discount =
    coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal)
  return { discount, code: coupon.code }
}

export async function quoteTotals(subtotal: number, couponCode?: string, userId?: string) {
  const settings = await getSettings()
  const { discount, code } = await applyCoupon(couponCode, subtotal, userId)
  const afterDiscount = Math.max(0, subtotal - discount)
  const shippingFee = afterDiscount >= settings.freeShippingOver ? 0 : settings.shippingFee
  const tax = Math.round((afterDiscount * (settings.taxPercent ?? 0)) / 100)
  const total = afterDiscount + shippingFee + tax
  return { subtotal, discount, shippingFee, tax, total, couponCode: code, settings }
}
