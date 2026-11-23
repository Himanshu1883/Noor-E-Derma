import { json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { AuditLog } from "@/models/AuditLog"

export const GET = withHandler(async () => {
  await requireAdmin()
  await connectDb()
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(80)
  return json({ logs })
})
