import { z } from "zod"
import { json, withHandler } from "@/lib/api"
import { requireAdmin } from "@/lib/auth/session"
import { connectDb } from "@/lib/db"
import { Category } from "@/models/Category"

const schema = z.object({
  slug: z.string().min(2),
  title: z.string().min(2),
  accent: z.string().optional().default(""),
  eyebrow: z.string().optional().default("Collection"),
  intro: z.string().optional().default(""),
  productSlugs: z.array(z.string()).optional().default([]),
})

export const GET = withHandler(async () => {
  await requireAdmin()
  await connectDb()
  return json({ categories: await Category.find().sort({ title: 1 }) })
})

export const POST = withHandler(async (request) => {
  await requireAdmin()
  const body = schema.parse(await request.json())
  await connectDb()
  const category = await Category.findOneAndUpdate({ slug: body.slug }, body, { upsert: true, returnDocument: "after" })
  return json({ category })
})
