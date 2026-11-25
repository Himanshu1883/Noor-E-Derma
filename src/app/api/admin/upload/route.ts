import { ApiError, json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { saveUpload } from "@/lib/gridfs"

export const POST = withHandler(async (request) => {
  await requireAdmin()
  const form = await request.formData()
  const file = form.get("file")
  if (!(file instanceof File) || file.size === 0) throw new ApiError(400, "Choose a file")
  try {
    const saved = await saveUpload(file)
    return json(saved)
  } catch (err) {
    throw new ApiError(400, err instanceof Error ? err.message : "Could not upload file")
  }
})
