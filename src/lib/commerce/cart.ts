import mongoose from "mongoose"
import { ApiError } from "@/lib/api"
import { getOrCreateGuestId, getSessionUser } from "@/lib/auth/session"
import { availableStock, toStoreProduct } from "@/lib/catalog"
import { connectDb } from "@/lib/db"
import { Cart } from "@/models/Cart"
import { Product } from "@/models/Product"

async function findProduct(idOrSlug: string) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug) && String(new mongoose.Types.ObjectId(idOrSlug)) === idOrSlug) {
    return Product.findById(idOrSlug)
  }
  return Product.findOne({ slug: idOrSlug })
}

export async function loadCart() {
  await connectDb()
  const user = await getSessionUser()
  if (user) {
    let cart = await Cart.findOne({ userId: user._id })
    if (!cart) cart = await Cart.create({ userId: user._id, lines: [] })
    return cart
  }
  const guestId = await getOrCreateGuestId()
  let cart = await Cart.findOne({ guestId })
  if (!cart) cart = await Cart.create({ guestId, lines: [] })
  return cart
}

export async function mergeGuestCart(userId: string) {
  await connectDb()
  const guestId = await getOrCreateGuestId()
  const guest = await Cart.findOne({ guestId })
  let userCart = await Cart.findOne({ userId })
  if (!userCart) userCart = await Cart.create({ userId, lines: [] })
  if (guest?.lines?.length) {
    for (const line of guest.lines) {
      const existing = userCart.lines.find((l) => String(l.productId) === String(line.productId))
      if (existing) existing.quantity = Math.min(20, existing.quantity + line.quantity)
      else userCart.lines.push(line)
    }
    if (guest.couponCode && !userCart.couponCode) userCart.couponCode = guest.couponCode
    await userCart.save()
    await guest.deleteOne()
  }
  return userCart
}

export async function serializeCart(cart: Awaited<ReturnType<typeof loadCart>>) {
  const ids = cart.lines.map((l) => l.productId)
  const products = await Product.find({ _id: { $in: ids }, active: true })
  const byId = new Map(products.map((p) => [String(p._id), p]))
  const lines = cart.lines
    .map((line) => {
      const product = byId.get(String(line.productId))
      if (!product) return null
      const qty = Math.min(line.quantity, Math.max(1, availableStock(product)))
      return {
        productId: String(product._id),
        quantity: qty,
        product: toStoreProduct(product),
      }
    })
    .filter(Boolean)
  const subtotal = lines.reduce((sum, line) => sum + (line?.product.price ?? 0) * (line?.quantity ?? 0), 0)
  const count = lines.reduce((sum, line) => sum + (line?.quantity ?? 0), 0)
  return { id: String(cart._id), couponCode: cart.couponCode, lines, subtotal, count }
}

export async function setCartLine(productId: string, quantity: number) {
  await connectDb()
  const product = await findProduct(productId)
  if (!product || !product.active) throw new ApiError(404, "Product not found")
  const max = availableStock(product)
  if (quantity > 0 && max < 1) throw new ApiError(409, "This product is out of stock")
  const cart = await loadCart()
  const pid = String(product._id)
  const nextQty = Math.max(0, Math.min(20, quantity, max || quantity))
  const remaining = cart.lines.filter((l) => String(l.productId) !== pid)
  if (nextQty > 0) remaining.push({ productId: product._id, quantity: nextQty })
  cart.set("lines", remaining)
  await cart.save()
  return serializeCart(cart)
}
