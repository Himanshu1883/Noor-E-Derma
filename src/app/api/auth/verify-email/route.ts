import { ApiError, json, withHandler } from "@/lib/api"
import { hashToken } from "@/lib/crypto"
import { connectDb } from "@/lib/db"
import { Token } from "@/models/Token"
import { User } from "@/models/User"

export const POST = withHandler(async (request) => {
  const body = (await request.json().catch(() => null)) as { token?: string } | null
  if (!body?.token) throw new ApiError(400, "Missing token")
  await connectDb()
  const rec = await Token.findOne({ tokenHash: hashToken(body.token), type: "email_verify", expiresAt: { $gt: new Date() } })
  if (!rec) throw new ApiError(400, "This verification link is invalid or expired")
  await User.findByIdAndUpdate(rec.userId, { emailVerifiedAt: new Date() })
  await rec.deleteOne()
  return json({ ok: true, message: "Email verified" })
})
