import { z } from "zod"
import { json, parseJson, withHandler } from "@/lib/api"
import { loadCart, serializeCart, setCartLine } from "@/lib/commerce/cart"
import { expireReservations } from "@/lib/commerce/inventory"

const bodySchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(0).max(20),
})

export const GET = withHandler(async () => {
  await expireReservations()
  const cart = await loadCart()
  return json(await serializeCart(cart))
})

export const POST = withHandler(async (request) => {
  const body = await parseJson(request, bodySchema)
  const cart = await setCartLine(body.productId, body.quantity)
  return json(cart)
})

export const DELETE = withHandler(async () => {
  const cart = await loadCart()
  cart.set("lines", [])
  cart.couponCode = ""
  await cart.save()
  return json(await serializeCart(cart))
})
