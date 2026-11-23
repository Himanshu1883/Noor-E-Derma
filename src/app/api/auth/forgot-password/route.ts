import { clientIp, json, parseJson, withHandler } from "@/lib/api"
import { hashToken, randomToken } from "@/lib/crypto"
import { connectDb } from "@/lib/db"
import { env } from "@/lib/env"
import { sendResetEmail } from "@/lib/mail"
import { rateLimit } from "@/lib/rate-limit"
import { emailSchema } from "@/lib/validators"
import { Token } from "@/models/Token"
import { User } from "@/models/User"

export const POST = withHandler(async (request) => {
  rateLimit(`forgot:${clientIp(request)}`, 5, 15 * 60 * 1000)
  const body = await parseJson(request, emailSchema)
  await connectDb()
  const user = await User.findOne({ email: body.email.toLowerCase() })
  if (user?.passwordHash) {
    await Token.deleteMany({ userId: user._id, type: "password_reset" })
    const token = randomToken()
    await Token.create({
      userId: user._id,
      type: "password_reset",
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    })
    await sendResetEmail(user.email, `${env.appUrl}/reset-password?token=${token}`)
  }
  return json({ message: "If an account exists, a reset link has been sent." })
})
