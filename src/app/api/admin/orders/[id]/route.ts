import { z } from "zod"
import { ApiError, json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { audit } from "@/lib/audit"
import { releaseStock } from "@/lib/commerce/inventory"
import { connectDb } from "@/lib/db"
import { sendOrderEmail } from "@/lib/mail"
import { formatINR } from "@/lib/format"
import { ensureTimeline, type TrackStepKey } from "@/lib/commerce/tracking"
import { ORDER_STATUSES, Order } from "@/models/Order"

const schema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  trackingUrl: z.string().optional(),
  notes: z.string().optional(),
  cancelReason: z.string().optional(),
})

export const GET = withHandler(async (_request, context) => {
  await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  await connectDb()
  const order = await Order.findById(id)
  if (!order) throw new ApiError(404, "Order not found")
  return json({ order })
})

export const PATCH = withHandler(async (request, context) => {
  const admin = await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  const body = schema.parse(await request.json())
  await connectDb()
  const order = await Order.findById(id)
  if (!order) throw new ApiError(404, "Order not found")

  if (body.status === "cancelled" && order.status !== "cancelled") {
    if (order.inventoryReserved && !order.inventoryCommitted) {
      await releaseStock(
        order.lines.map((l) => ({ productId: String(l.productId), quantity: l.quantity ?? 1 })),
        String(order._id),
        "Admin cancelled",
      )
      order.inventoryReserved = false
    }
    order.cancelledAt = new Date()
    order.cancelReason = body.cancelReason ?? "Cancelled by admin"
  }
  if (body.status === "refunded") {
    order.paymentStatus = "refunded"
    order.refundedAt = new Date()
  }
  if (body.status) {
    order.status = body.status
    const map: Record<string, TrackStepKey> = {
      confirmed: "approved",
      paid: "approved",
      packed: "processed",
      shipped: "shipped",
      delivered: "delivered",
    }
    const step = map[body.status]
    if (step) ensureTimeline(order, step)
    if (body.status === "delivered") {
      ensureTimeline(order, "delivered", `Your order is completed and delivered on ${new Date().toLocaleString("en-IN")}`)
    }
  }
  if (body.trackingNumber != null) order.trackingNumber = body.trackingNumber
  if (body.carrier != null) order.carrier = body.carrier
  if (body.trackingUrl != null) order.trackingUrl = body.trackingUrl
  if (body.notes != null) order.notes = body.notes
  await order.save()
  await audit({ actorId: String(admin._id), actorEmail: admin.email, action: "order.update", entity: "order", entityId: id, meta: body })
  await sendOrderEmail(order.email, order.orderNumber, order.status, formatINR(order.total))
  return json({ order })
})

export const DELETE = withHandler(async (_request, context) => {
  const admin = await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  await connectDb()
  const order = await Order.findById(id)
  if (!order) throw new ApiError(404, "Order not found")
  if (!["cancelled", "pending_payment", "refunded"].includes(order.status)) {
    throw new ApiError(400, "Only cancelled, unpaid, or refunded orders can be deleted")
  }
  await order.deleteOne()
  await audit({ actorId: String(admin._id), actorEmail: admin.email, action: "order.delete", entity: "order", entityId: id })
  return json({ ok: true })
})
