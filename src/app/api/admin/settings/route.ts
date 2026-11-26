import { json, parseJson, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { audit } from "@/lib/audit"
import { getSettings } from "@/lib/commerce/pricing"
import { toStorefrontSettings } from "@/lib/storefront-settings"
import { settingsSchema } from "@/lib/validators"

export const GET = withHandler(async () => {
  await requireAdmin()
  const settings = await getSettings()
  return json({ settings: toStorefrontSettings(settings.toObject() as Record<string, unknown>) })
})

export const PATCH = withHandler(async (request) => {
  const admin = await requireAdmin()
  const body = await parseJson(request, settingsSchema)
  const settings = await getSettings()
  Object.assign(settings, body)
  await settings.save()
  await audit({ actorId: String(admin._id), actorEmail: admin.email, action: "settings.update", entity: "settings" })
  return json({ settings: toStorefrontSettings(settings.toObject() as Record<string, unknown>) })
})
