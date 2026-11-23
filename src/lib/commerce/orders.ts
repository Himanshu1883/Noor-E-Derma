import { commitStock } from "@/lib/commerce/inventory"
import { sendOrderEmail } from "@/lib/mail"
import { formatINR } from "@/lib/format"
import { Coupon } from "@/models/Coupon"
import { Order } from "@/models/Order"
import { Cart } from "@/models/Cart"

export async function markPaid(order: InstanceType<typeof Order>, paymentId: string) {
  if (order.paymentStatus === "paid") return order
  if (!order.inventoryCommitted) {
    await commitStock(
      order.lines.map((l) => ({ productId: String(l.productId), quantity: l.quantity ?? 1 })),
      String(order._id),
    )
    order.inventoryCommitted = true
    order.inventoryReserved = false
  }
  order.paymentStatus = "paid"
  order.status = "confirmed"
  order.razorpayPaymentId = paymentId
  order.paidAt = new Date()
  if (order.couponCode) await Coupon.updateOne({ code: order.couponCode }, { $inc: { usedCount: 1 } })
  await order.save()
  if (order.userId) {
    await Cart.updateOne({ userId: order.userId }, { $set: { lines: [], couponCode: "" } })
  }
  await sendOrderEmail(order.email, order.orderNumber, "paid", formatINR(order.total))
  return order
}
