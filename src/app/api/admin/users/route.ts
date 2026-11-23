import { json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { User } from "@/models/User"

export const GET = withHandler(async (request) => {
  await requireAdmin()
  await connectDb()
  const q = new URL(request.url).searchParams.get("q") ?? ""
  const filter = q ? { $or: [{ email: new RegExp(q, "i") }, { name: new RegExp(q, "i") }] } : {}
  const users = await User.find(filter).select("-passwordHash -failedLoginAttempts").sort({ createdAt: -1 }).limit(100)
  return json({ users })
})
