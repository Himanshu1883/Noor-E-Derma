import { json, parseJson, withHandler } from "@/lib/api"
import { requireUser, toPublicUser } from "@/lib/auth/session"
import { profileSchema } from "@/lib/validators"

export const PATCH = withHandler(async (request) => {
  const user = await requireUser()
  const body = await parseJson(request, profileSchema)
  user.name = body.name
  user.phone = body.phone ?? ""
  await user.save()
  return json({ user: toPublicUser(user), message: "Profile updated" })
})
