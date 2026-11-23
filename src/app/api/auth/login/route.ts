import { ApiError, clientIp, json, parseJson, withHandler } from "@/lib/api"
import { verifyPassword } from "@/lib/auth/password"
import { createSession, toPublicUser } from "@/lib/auth/session"
import { mergeGuestCart } from "@/lib/commerce/cart"
import { connectDb } from "@/lib/db"
import { rateLimit } from "@/lib/rate-limit"
import { loginSchema } from "@/lib/validators"
import { User } from "@/models/User"

export const POST = withHandler(async (request) => {
  rateLimit(`login:${clientIp(request)}`, 12, 15 * 60 * 1000)
  const body = await parseJson(request, loginSchema)
  await connectDb()
  const user = await User.findOne({ email: body.email.toLowerCase() })
  if (!user || !user.passwordHash) throw new ApiError(401, "Invalid email or password")
  if (user.status !== "active") throw new ApiError(403, "This account has been disabled")
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new ApiError(423, "Too many failed attempts. Try again in 15 minutes.")
  }
  const ok = await verifyPassword(body.password, user.passwordHash)
  if (!ok) {
    user.failedLoginAttempts += 1
    if (user.failedLoginAttempts >= 5) {
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000)
      user.failedLoginAttempts = 0
    }
    await user.save()
    throw new ApiError(401, "Invalid email or password")
  }
  user.failedLoginAttempts = 0
  user.lockedUntil = undefined
  user.lastLoginAt = new Date()
  await user.save()
  await createSession(String(user._id), { ip: clientIp(request), userAgent: request.headers.get("user-agent") ?? "" })
  await mergeGuestCart(String(user._id))
  return json({ user: toPublicUser(user) })
})
