import { ApiError, json, parseJson, withHandler } from "@/lib/api"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { destroyAllSessions, requireUser } from "@/lib/auth/session"
import { passwordChangeSchema } from "@/lib/validators"

export const POST = withHandler(async (request) => {
  const user = await requireUser()
  const body = await parseJson(request, passwordChangeSchema)
  if (!user.passwordHash) throw new ApiError(400, "This account uses Google sign-in")
  const ok = await verifyPassword(body.currentPassword, user.passwordHash)
  if (!ok) throw new ApiError(400, "Current password is incorrect")
  user.passwordHash = await hashPassword(body.newPassword)
  await user.save()
  await destroyAllSessions(String(user._id))
  return json({ message: "Password changed. Please sign in again." })
})
