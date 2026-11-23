import { json, withHandler } from "@/lib/api"
import { getSessionUser } from "@/lib/auth/session"
import { loadCart, serializeCart } from "@/lib/commerce/cart"
import { quoteTotals } from "@/lib/commerce/pricing"
import { z } from "zod"

export const POST = withHandler(async (request) => {
  const body = z.object({ code: z.string() }).parse(await request.json())
  const user = await getSessionUser()
  const cart = await loadCart()
  cart.couponCode = body.code.trim().toUpperCase()
  await cart.save()
  const serialized = await serializeCart(cart)
  const totals = await quoteTotals(serialized.subtotal, cart.couponCode, user ? String(user._id) : undefined)
  if (!totals.couponCode) {
    cart.couponCode = ""
    await cart.save()
    return json({ error: "This code is not valid for your bag", totals }, 400)
  }
  return json({ totals, message: `Applied ${totals.couponCode}` })
})
