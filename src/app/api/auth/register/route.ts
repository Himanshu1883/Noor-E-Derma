import { ApiError, clientIp, parseJson, withHandler, json } from "@/lib/api"
import { hashPassword } from "@/lib/auth/password"
import { createSession, toPublicUser } from "@/lib/auth/session"
import { mergeGuestCart } from "@/lib/commerce/cart"
import { hashToken, randomToken } from "@/lib/crypto"
import { connectDb } from "@/lib/db"
import { env } from "@/lib/env"
import { sendVerifyEmail } from "@/lib/mail"
import { rateLimit } from "@/lib/rate-limit"
import { registerSchema } from "@/lib/validators"
import { Token } from "@/models/Token"
import { User } from "@/models/User"

export const POST = withHandler(async (request) => {
  rateLimit(`register:${clientIp(request)}`, 8, 15 * 60 * 1000)
  const body = await parseJson(request, registerSchema)
  await connectDb()
  const email = body.email.toLowerCase()
  const exists = await User.findOne({ email })
  if (exists) throw new ApiError(409, "An account with this email already exists")
  const user = await User.create({
    name: body.name,
    email,
    passwordHash: await hashPassword(body.password),
    role: "customer",
    status: "active",
  })
  const token = randomToken()
  await Token.create({
    userId: user._id,
    type: "email_verify",
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  })
  await sendVerifyEmail(email, `${env.appUrl}/verify-email?token=${token}`)
  await createSession(String(user._id), { ip: clientIp(request), userAgent: request.headers.get("user-agent") ?? "" })
  await mergeGuestCart(String(user._id))
  return json({ user: toPublicUser(user), message: "Account created. Please verify your email." }, 201)
})
