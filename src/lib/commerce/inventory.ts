import mongoose from "mongoose"
import { ApiError } from "@/lib/api"
import { connectDb } from "@/lib/db"
import { availableStock } from "@/lib/catalog"
import { InventoryLog } from "@/models/InventoryLog"
import { Order } from "@/models/Order"
import { Product } from "@/models/Product"

export async function reserveStock(lines: { productId: string; quantity: number }[], orderId?: string) {
  await connectDb()
  for (const line of lines) {
    const updated = await Product.findOneAndUpdate(
      {
        _id: line.productId,
        $expr: { $gte: [{ $subtract: ["$stock", "$reserved"] }, line.quantity] },
      },
      { $inc: { reserved: line.quantity } },
      { new: true },
    )
    if (!updated) {
      throw new ApiError(409, "One or more items are no longer in stock")
    }
    await InventoryLog.create({
      productId: line.productId,
      type: "reserve",
      quantity: line.quantity,
      orderId,
      note: "Checkout reservation",
    })
  }
}

export async function releaseStock(lines: { productId: string; quantity: number }[], orderId?: string, note = "Released reservation") {
  await connectDb()
  for (const line of lines) {
    await Product.findByIdAndUpdate(line.productId, { $inc: { reserved: -Math.abs(line.quantity) } })
    await InventoryLog.create({
      productId: line.productId,
      type: "release",
      quantity: -Math.abs(line.quantity),
      orderId,
      note,
    })
  }
}

export async function commitStock(lines: { productId: string; quantity: number }[], orderId?: string) {
  await connectDb()
  for (const line of lines) {
    await Product.findByIdAndUpdate(line.productId, {
      $inc: { stock: -Math.abs(line.quantity), reserved: -Math.abs(line.quantity) },
    })
    await InventoryLog.create({
      productId: line.productId,
      type: "sale",
      quantity: -Math.abs(line.quantity),
      orderId,
      note: "Order paid",
    })
  }
}

export async function restock(productId: string, quantity: number, actorId?: string, note = "Restock") {
  await connectDb()
  if (quantity === 0) throw new ApiError(400, "Quantity cannot be zero")
  const doc = await Product.findByIdAndUpdate(productId, { $inc: { stock: quantity } }, { new: true })
  if (!doc) throw new ApiError(404, "Product not found")
  await InventoryLog.create({
    productId,
    type: quantity > 0 ? "restock" : "adjust",
    quantity,
    actorId,
    note,
  })
  return doc
}

export async function expireReservations() {
  await connectDb()
  const expired = await Order.find({
    status: "pending_payment",
    inventoryReserved: true,
    inventoryCommitted: false,
    reservationExpiresAt: { $lt: new Date() },
  })
  for (const order of expired) {
    await releaseStock(
      order.lines.map((l) => ({ productId: String(l.productId), quantity: l.quantity ?? 1 })),
      String(order._id),
      "Reservation expired",
    )
    order.inventoryReserved = false
    order.status = "cancelled"
    order.paymentStatus = "failed"
    order.cancelledAt = new Date()
    order.cancelReason = "Payment not completed"
    await order.save()
  }
  return expired.length
}

export function assertCanSell(stock: number, reserved: number, qty: number) {
  if (availableStock({ stock, reserved }) < qty) {
    throw new ApiError(409, "Not enough stock for this item")
  }
}

export function oid(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid id")
  return new mongoose.Types.ObjectId(id)
}
