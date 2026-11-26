import { clientIp, json, parseJson, withHandler } from "@/lib/api"
import { connectDb } from "@/lib/db"
import { rateLimit } from "@/lib/rate-limit"
import { emailSchema } from "@/lib/validators"
import { PasswordResetRequest } from "@/models/PasswordResetRequest"
import { User } from "@/models/User"

const RECEIVED = "We've received your request. A password reset link will be sent to this email shortly."

export const POST = withHandler(async (request) => {
  rateLimit(`forgot:${clientIp(request)}`, 5, 15 * 60 * 1000)
  const body = await parseJson(request, emailSchema)
  await connectDb()
  const email = body.email.toLowerCase()
  const user = await User.findOne({ email })
  if (user?.passwordHash) {
    const open = await PasswordResetRequest.findOne({
      userId: user._id,
      status: { $in: ["pending", "sent"] },
    }).sort({ requestedAt: -1 })
    if (open) {
      open.requestedAt = new Date()
      open.name = user.name
      open.email = user.email
      if (open.status === "sent") open.status = "pending"
      await open.save()
    } else {
      await PasswordResetRequest.create({
        userId: user._id,
        email: user.email,
        name: user.name,
        status: "pending",
        requestedAt: new Date(),
      })
    }
  }
  return json({ message: RECEIVED })
})
