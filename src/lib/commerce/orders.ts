import { loadCart } from "@/lib/commerce/cart"
import { commitStock } from "@/lib/commerce/inventory"
import { sendOrderEmail } from "@/lib/mail"
import { formatINR } from "@/lib/format"
import { Coupon } from "@/models/Coupon"
import { Order } from "@/models/Order"
import { Cart } from "@/models/Cart"
import { ensureTimeline } from "@/lib/commerce/tracking"

async function clearOrderCart(order: InstanceType<typeof Order>) {
  if (order.userId) {
    await Cart.updateOne({ userId: order.userId }, { $set: { lines: [], couponCode: "" } })
  }
  const cart = await loadCart()
  cart.set("lines", [])
  cart.couponCode = ""
  await cart.save()
}

async function commitIfNeeded(order: InstanceType<typeof Order>, notePaid: boolean) {
  if (order.inventoryCommitted) return
  await commitStock(
    order.lines.map((l) => ({ productId: String(l.productId), quantity: l.quantity ?? 1 })),
    String(order._id),
  )
  order.inventoryCommitted = true
  order.inventoryReserved = false
  void notePaid
}

export async function markPaid(order: InstanceType<typeof Order>, paymentId: string) {
  if (order.paymentStatus === "paid") return order
  await commitIfNeeded(order, true)
  order.paymentMethod = "razorpay"
  order.paymentStatus = "paid"
  order.status = "confirmed"
  order.razorpayPaymentId = paymentId
  order.paidAt = new Date()
  ensureTimeline(order, "placed")
  ensureTimeline(order, "approved", "Your Order Has Been Approved")
  if (order.couponCode) await Coupon.updateOne({ code: order.couponCode }, { $inc: { usedCount: 1 } })
  await order.save()
  await clearOrderCart(order)
  await sendOrderEmail(order.email, order.orderNumber, "paid", formatINR(order.total))
  return order
}

export async function confirmCod(order: InstanceType<typeof Order>) {
  await commitIfNeeded(order, false)
  order.paymentMethod = "cod"
  order.paymentStatus = "pending"
  order.status = "confirmed"
  ensureTimeline(order, "placed")
  ensureTimeline(order, "approved", "Your Order Has Been Approved")
  if (order.couponCode) await Coupon.updateOne({ code: order.couponCode }, { $inc: { usedCount: 1 } })
  await order.save()
  await clearOrderCart(order)
  await sendOrderEmail(order.email, order.orderNumber, "confirmed", formatINR(order.total))
  return order
}
