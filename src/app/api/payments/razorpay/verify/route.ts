import { z } from "zod"
import { ApiError, json, withHandler } from "@/lib/api"
import { loadCart } from "@/lib/commerce/cart"
import { markPaid } from "@/lib/commerce/orders"
import { verifyCheckoutSignature } from "@/lib/commerce/razorpay"
import { connectDb } from "@/lib/db"
import { Order } from "@/models/Order"

const schema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
})

export const POST = withHandler(async (request) => {
  const body = schema.parse(await request.json())
  if (!verifyCheckoutSignature(body.razorpay_order_id, body.razorpay_payment_id, body.razorpay_signature)) {
    throw new ApiError(400, "Payment signature mismatch")
  }
  await connectDb()
  const order = await Order.findOne({ razorpayOrderId: body.razorpay_order_id })
  if (!order) throw new ApiError(404, "Order not found")
  await markPaid(order, body.razorpay_payment_id)
  const cart = await loadCart()
  cart.set("lines", [])
  cart.couponCode = ""
  await cart.save()
  return json({ ok: true, orderNumber: order.orderNumber, orderId: String(order._id) })
})
