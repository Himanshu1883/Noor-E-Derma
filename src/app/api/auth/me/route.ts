import { json, withHandler } from "@/lib/api"
import { getSessionUser, toPublicUser } from "@/lib/auth/session"

export const GET = withHandler(async () => {
  const user = await getSessionUser()
  return json({ user: user ? toPublicUser(user) : null })
})
