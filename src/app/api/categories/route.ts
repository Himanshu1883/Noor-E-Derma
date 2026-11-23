import { json, withHandler } from "@/lib/api"
import { connectDb } from "@/lib/db"
import { Category } from "@/models/Category"

export const GET = withHandler(async () => {
  await connectDb()
  const categories = await Category.find().sort({ title: 1 })
  return json({
    categories: categories.map((c) => ({
      slug: c.slug,
      title: c.title,
      accent: c.accent,
      eyebrow: c.eyebrow,
      intro: c.intro,
      productSlugs: c.productSlugs,
    })),
  })
})
