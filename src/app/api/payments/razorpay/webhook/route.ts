import { NextResponse } from "next/server"
import { releaseStock } from "@/lib/commerce/inventory"
import { markPaid } from "@/lib/commerce/orders"
import { verifyWebhookSignature } from "@/lib/commerce/razorpay"
import { connectDb } from "@/lib/db"
import { logger } from "@/lib/logger"
import { Order } from "@/models/Order"
import { ProcessedEvent } from "@/models/ProcessedEvent"

export async function POST(request: Request) {
  const raw = await request.text()
  const signature = request.headers.get("x-razorpay-signature") || ""
  try {
    if (!verifyWebhookSignature(raw, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }
  const event = JSON.parse(raw) as {
    event?: string
    payload?: { payment?: { entity?: { id: string; order_id: string; status: string } } }
  }
  const payment = event.payload?.payment?.entity
  const eventId = `${event.event}:${payment?.id ?? raw.slice(0, 24)}`
  await connectDb()
  const seen = await ProcessedEvent.findOne({ eventId })
  if (seen) return NextResponse.json({ ok: true, duplicate: true })
  await ProcessedEvent.create({ eventId })

  if (payment?.order_id) {
    const order = await Order.findOne({ razorpayOrderId: payment.order_id })
    if (order) {
      if (event.event === "payment.captured" || payment.status === "captured") {
        await markPaid(order, payment.id)
      }
      if (event.event === "payment.failed") {
        if (order.inventoryReserved && !order.inventoryCommitted) {
          await releaseStock(
            order.lines.map((l) => ({ productId: String(l.productId), quantity: l.quantity ?? 1 })),
            String(order._id),
            "Payment failed",
          )
          order.inventoryReserved = false
        }
        order.paymentStatus = "failed"
        await order.save()
      }
    }
  }
  logger.info("razorpay_webhook", { event: event.event })
  return NextResponse.json({ ok: true })
}
