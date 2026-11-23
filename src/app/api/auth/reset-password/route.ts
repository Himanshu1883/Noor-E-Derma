import { ApiError, json, parseJson, withHandler } from "@/lib/api"
import { hashPassword } from "@/lib/auth/password"
import { destroyAllSessions } from "@/lib/auth/session"
import { hashToken } from "@/lib/crypto"
import { connectDb } from "@/lib/db"
import { resetSchema } from "@/lib/validators"
import { Token } from "@/models/Token"
import { User } from "@/models/User"

export const POST = withHandler(async (request) => {
  const body = await parseJson(request, resetSchema)
  await connectDb()
  const rec = await Token.findOne({ tokenHash: hashToken(body.token), type: "password_reset", expiresAt: { $gt: new Date() } })
  if (!rec) throw new ApiError(400, "This reset link is invalid or expired")
  const user = await User.findById(rec.userId)
  if (!user) throw new ApiError(400, "This reset link is invalid or expired")
  user.passwordHash = await hashPassword(body.password)
  user.failedLoginAttempts = 0
  user.lockedUntil = undefined
  await user.save()
  await rec.deleteOne()
  await destroyAllSessions(String(user._id))
  return json({ message: "Password updated. Please sign in." })
})
