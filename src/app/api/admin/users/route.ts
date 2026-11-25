import { json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { Order } from "@/models/Order"
import { User } from "@/models/User"

export const GET = withHandler(async (request) => {
  await requireAdmin()
  await connectDb()
  const q = new URL(request.url).searchParams.get("q") ?? ""
  const filter = q ? { $or: [{ email: new RegExp(q, "i") }, { name: new RegExp(q, "i") }, { phone: new RegExp(q, "i") }] } : {}
  const users = await User.find(filter)
    .select("-passwordHash -failedLoginAttempts -lockedUntil")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean()
  const emails = users.map((u) => u.email)
  const counts = emails.length
    ? await Order.aggregate([{ $match: { email: { $in: emails } } }, { $group: { _id: "$email", count: { $sum: 1 } } }])
    : []
  const byEmail = Object.fromEntries(counts.map((c) => [c._id, c.count]))
  return json({
    users: users.map((u) => ({
      ...u,
      orderCount: byEmail[u.email] ?? 0,
    })),
  })
})
