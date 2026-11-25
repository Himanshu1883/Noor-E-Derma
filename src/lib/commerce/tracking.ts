import type { OrderDoc } from "@/models/Order"

type TrackOrder = Pick<
  OrderDoc,
  | "orderNumber"
  | "status"
  | "paymentStatus"
  | "paymentMethod"
  | "razorpayPaymentId"
  | "trackingNumber"
  | "carrier"
  | "trackingUrl"
  | "total"
  | "subtotal"
  | "discount"
  | "shippingFee"
  | "createdAt"
  | "paidAt"
  | "shipping"
  | "lines"
  | "phone"
  | "name"
  | "email"
  | "timeline"
>

export const TRACK_STEPS = [
  { key: "placed", label: "Placed" },
  { key: "approved", label: "Approved" },
  { key: "processed", label: "Processed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
] as const

export type TrackStepKey = (typeof TRACK_STEPS)[number]["key"]

export const TRACK_DETAILS: Record<TrackStepKey, string> = {
  placed: "Your Order Is Successfully Placed",
  approved: "Your Order Has Been Approved",
  processed: "Your Order Status Is Processing",
  shipped: "Your Order Has Been Shipped",
  delivered: "Your order is completed and delivered",
}

const STATUS_STEP: Record<string, number> = {
  pending_payment: 0,
  paid: 1,
  confirmed: 1,
  packed: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
  refunded: -1,
}

export function stepIndexForStatus(status: string) {
  return STATUS_STEP[status] ?? 0
}

export function ensureTimeline(
  order: OrderDoc,
  key: TrackStepKey,
  detail = TRACK_DETAILS[key],
) {
  const list = order.timeline ?? []
  if (list.some((event) => event.key === key)) return
  list.push({
    key,
    title: TRACK_STEPS.find((s) => s.key === key)?.label ?? key,
    detail,
    at: new Date(),
  })
  order.timeline = list
}

export function timelineForStatus(status: string) {
  const index = stepIndexForStatus(status)
  if (index < 0) return [] as TrackStepKey[]
  return TRACK_STEPS.slice(0, index + 1).map((s) => s.key)
}

export function serializeTrack(order: TrackOrder) {
  const current = stepIndexForStatus(order.status)
  const created = order.createdAt?.toISOString()
  const events = (order.timeline ?? []).map((event) => ({
    key: event.key,
    title: event.title,
    detail: event.detail,
    at: event.at ? new Date(event.at).toISOString() : created,
  }))
  if (!events.length && current >= 0) {
    for (const step of TRACK_STEPS.slice(0, current + 1)) {
      events.push({
        key: step.key,
        title: step.label,
        detail: step.key === "delivered" && created ? `${TRACK_DETAILS[step.key]} on ${created}` : TRACK_DETAILS[step.key],
        at: created,
      })
    }
  }
  const byKey = new Map(events.map((event) => [event.key, event]))
  const steps = TRACK_STEPS.map((step, index) => ({
    key: step.key,
    label: step.label,
    done: current >= 0 && index <= current,
    current: current === index,
    at: byKey.get(step.key)?.at ?? (current >= 0 && index <= current ? order.createdAt?.toISOString() : undefined),
  }))
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod:
      order.paymentMethod ||
      (order.razorpayPaymentId ? "razorpay" : order.paymentStatus === "pending" && order.status === "confirmed" ? "cod" : "razorpay"),
    trackingNumber: order.trackingNumber,
    carrier: order.carrier,
    trackingUrl: order.trackingUrl,
    total: order.total,
    subtotal: order.subtotal,
    discount: order.discount,
    shippingFee: order.shippingFee,
    createdAt: order.createdAt?.toISOString(),
    paidAt: order.paidAt?.toISOString(),
    shipping: order.shipping,
    lines: order.lines,
    phone: order.phone,
    name: order.name,
    email: order.email,
    cancelled: current < 0,
    steps,
    events,
  }
}
