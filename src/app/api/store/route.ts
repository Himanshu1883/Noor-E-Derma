import { json, withHandler } from "@/lib/api"
import { getSettings } from "@/lib/commerce/pricing"
import { toStorefrontSettings } from "@/lib/storefront-settings"

export const GET = withHandler(async () => {
  const settings = await getSettings()
  return json({ settings: toStorefrontSettings(settings.toObject() as Record<string, unknown>) })
})
