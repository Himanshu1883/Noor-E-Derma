import { json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { PasswordResetRequest } from "@/models/PasswordResetRequest"

export const GET = withHandler(async () => {
  await requireAdmin()
  await connectDb()
  const requests = await PasswordResetRequest.find()
    .sort({ requestedAt: -1 })
    .limit(200)
    .lean()
  return json({
    requests: requests.map((r) => ({
      _id: String(r._id),
      userId: String(r.userId),
      email: r.email,
      name: r.name,
      status: r.status,
      requestedAt: r.requestedAt,
      sentAt: r.sentAt,
      usedAt: r.usedAt,
      sendCount: r.sendCount ?? 0,
    })),
  })
})
