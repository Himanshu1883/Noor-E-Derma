import { ApiError, json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { audit } from "@/lib/audit"
import { hashToken, randomToken } from "@/lib/crypto"
import { connectDb } from "@/lib/db"
import { env } from "@/lib/env"
import { sendResetEmail } from "@/lib/mail"
import { PasswordResetRequest } from "@/models/PasswordResetRequest"
import { Token } from "@/models/Token"
import { User } from "@/models/User"

export const POST = withHandler(async (_request, context) => {
  const admin = await requireAdmin()
  const { id } = await (context as { params: Promise<{ id: string }> }).params
  await connectDb()
  const rec = await PasswordResetRequest.findById(id)
  if (!rec) throw new ApiError(404, "Request not found")
  if (rec.status === "completed") throw new ApiError(400, "This reset was already used")
  const user = await User.findById(rec.userId)
  if (!user?.passwordHash) throw new ApiError(400, "This account cannot reset a password")

  await Token.deleteMany({ userId: user._id, type: "password_reset" })
  const token = randomToken()
  await Token.create({
    userId: user._id,
    type: "password_reset",
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  })
  await sendResetEmail(user.email, `${env.appUrl}/reset-password?token=${token}`)
  rec.status = "sent"
  rec.sentAt = new Date()
  rec.sendCount = (rec.sendCount ?? 0) + 1
  rec.name = user.name
  rec.email = user.email
  await rec.save()
  await audit({
    actorId: String(admin._id),
    actorEmail: admin.email,
    action: "password_reset.send",
    entity: "password_reset",
    entityId: String(rec._id),
  })
  return json({
    emailed: Boolean(env.smtpHost),
    request: {
      _id: String(rec._id),
      status: rec.status,
      sentAt: rec.sentAt,
      sendCount: rec.sendCount,
    },
  })
})
