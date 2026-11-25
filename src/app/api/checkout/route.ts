import { ApiError, json, parseJson, withHandler } from "@/lib/api"
import { getSessionUser, requireUser } from "@/lib/auth/session"
import { loadCart, serializeCart } from "@/lib/commerce/cart"
import { expireReservations, releaseStock, reserveStock } from "@/lib/commerce/inventory"
import { quoteTotals } from "@/lib/commerce/pricing"
import { confirmCod } from "@/lib/commerce/orders"
import { createRazorpayOrder, razorpayEnabled } from "@/lib/commerce/razorpay"
import { ensureTimeline } from "@/lib/commerce/tracking"
import { orderNumber } from "@/lib/crypto"
import { connectDb } from "@/lib/db"
import { env } from "@/lib/env"
import { sendOrderEmail } from "@/lib/mail"
import { checkoutSchema } from "@/lib/validators"
import { formatINR } from "@/lib/format"
import { Order } from "@/models/Order"
import { Product } from "@/models/Product"
import { User } from "@/models/User"

export const POST = withHandler(async (request) => {
  await expireReservations()
  await connectDb()
  const body = await parseJson(request, checkoutSchema)
  const user = await getSessionUser()
  const cart = await loadCart()
  const serialized = await serializeCart(cart)
  if (!serialized.lines.length) throw new ApiError(400, "Your bag is empty")

  const dbLines = []
  for (const line of serialized.lines) {
    const product = await Product.findById(line!.productId)
    if (!product) throw new ApiError(409, "A product in your bag is no longer available")
    dbLines.push({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0]?.src ?? "",
      sku: product.sku,
      price: product.price,
      quantity: line!.quantity,
    })
  }

  const totals = await quoteTotals(serialized.subtotal, body.couponCode || cart.couponCode, user ? String(user._id) : undefined)
  if (!totals.settings.paymentsEnabled) throw new ApiError(503, "Checkout is temporarily paused")

  const order = await Order.create({
    orderNumber: orderNumber(),
    userId: user?._id,
    email: body.email.toLowerCase(),
    phone: body.phone,
    name: body.name,
    shipping: body.shipping,
    lines: dbLines,
    subtotal: totals.subtotal,
    discount: totals.discount,
    shippingFee: totals.shippingFee,
    tax: totals.tax,
    total: totals.total,
    couponCode: totals.couponCode,
    status: "pending_payment",
    paymentStatus: "pending",
    paymentMethod: body.paymentMethod === "cod" ? "cod" : "razorpay",
    inventoryReserved: true,
    reservationExpiresAt: new Date(Date.now() + 30 * 60 * 1000),
    timeline: [],
  })
  ensureTimeline(order, "placed")
  await order.save()

  await reserveStock(
    dbLines.map((l) => ({ productId: String(l.productId), quantity: l.quantity })),
    String(order._id),
  )

  if (user && body.saveAddress) {
    const addresses = user.addresses ?? []
    const next = {
      label: "Home",
      name: body.shipping.name,
      phone: body.shipping.phone,
      line1: body.shipping.line1,
      line2: body.shipping.line2 ?? "",
      city: body.shipping.city,
      state: body.shipping.state,
      pincode: body.shipping.pincode,
      country: body.shipping.country ?? "India",
      isDefault: addresses.length === 0,
    }
    await User.findByIdAndUpdate(user._id, { $push: { addresses: next }, phone: user.phone || body.phone, name: user.name || body.name })
  }

  if (body.paymentMethod === "cod") {
    await confirmCod(order)
    return json({
      paymentMethod: "cod" as const,
      orderId: String(order._id),
      orderNumber: order.orderNumber,
      amount: totals.total,
    })
  }

  if (!razorpayEnabled()) {
    throw new ApiError(
      503,
      "Razorpay test keys are not configured. Use Cash on Delivery, or add real RAZORPAY_KEY_ID (rzp_test_…) and RAZORPAY_KEY_SECRET from the Razorpay Dashboard.",
    )
  }

  try {
    const rzpOrder = await createRazorpayOrder({
      amountInr: totals.total,
      receipt: order.orderNumber,
      notes: { orderId: String(order._id) },
    })
    order.razorpayOrderId = rzpOrder.id
    order.paymentMethod = "razorpay"
    await order.save()
    void sendOrderEmail(order.email, order.orderNumber, "awaiting payment", formatINR(order.total)).catch(() => undefined)

    return json({
      paymentMethod: "razorpay" as const,
      orderId: String(order._id),
      orderNumber: order.orderNumber,
      amount: totals.total,
      razorpayOrderId: rzpOrder.id,
      razorpayKey: env.razorpayKeyId,
      name: order.name,
      email: order.email,
      phone: order.phone,
    })
  } catch (err) {
    await releaseStock(
      dbLines.map((l) => ({ productId: String(l.productId), quantity: l.quantity })),
      String(order._id),
      "Razorpay order failed",
    )
    order.inventoryReserved = false
    order.status = "cancelled"
    order.paymentStatus = "failed"
    order.cancelReason = "Razorpay order create failed"
    order.cancelledAt = new Date()
    await order.save()
    throw err
  }
})

export const GET = withHandler(async () => {
  const user = await requireUser()
  const cart = await loadCart()
  const serialized = await serializeCart(cart)
  const totals = await quoteTotals(serialized.subtotal, cart.couponCode, String(user._id))
  return json({
    cart: serialized,
    totals,
    razorpayEnabled: razorpayEnabled(),
    profile: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses,
    },
  })
})
