import { ApiError, json, parseJson, withHandler } from "@/lib/api"
import { requireUser, toPublicUser } from "@/lib/auth/session"
import { addressSchema } from "@/lib/validators"

export const POST = withHandler(async (request) => {
  const user = await requireUser()
  const body = await parseJson(request, addressSchema)
  if (body.isDefault) user.addresses.forEach((a) => (a.isDefault = false))
  if (body.id) {
    const idx = user.addresses.findIndex((a) => String(a._id) === body.id)
    if (idx < 0) throw new ApiError(404, "Address not found")
    Object.assign(user.addresses[idx], body)
  } else {
    user.addresses.push(body)
  }
  await user.save()
  return json({ user: toPublicUser(user) })
})

export const DELETE = withHandler(async (request) => {
  const user = await requireUser()
  const url = new URL(request.url)
  const id = url.searchParams.get("id")
  user.set(
    "addresses",
    user.addresses.filter((a) => String(a._id) !== id),
  )
  await user.save()
  return json({ user: toPublicUser(user) })
})
