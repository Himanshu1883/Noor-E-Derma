import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import { collections } from "../src/data/collections"
import { getCatalog } from "../src/data/products"
import { Category } from "../src/models/Category"
import { Coupon } from "../src/models/Coupon"
import { Product } from "../src/models/Product"
import { MediaAsset } from "../src/models/MediaAsset"
import { Settings } from "../src/models/Settings"
import { User } from "../src/models/User"

async function mediaLookup() {
  const docs = await MediaAsset.find()
  return Object.fromEntries(docs.map((d) => [d.publicPath, d.src])) as Record<string, string>
}

function remapImages(
  images: { src: string; poster?: string; fileId?: string; alt?: string }[],
  media: Record<string, string>,
) {
  return images.map((img) => {
    const src = media[img.src] || img.src
    const poster = img.poster ? media[img.poster] || img.poster : img.poster
    return {
      ...img,
      src,
      poster,
      fileId: src.startsWith("/api/media/") ? src.split("/").pop() : img.fileId,
    }
  })
}

async function main() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error("Set MONGODB_URI in .env.local")
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "noor-e-derma" })

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@noorederma.example").toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe_Admin_123"
  const existingAdmin = await User.findOne({ email: adminEmail })
  if (!existingAdmin) {
    await User.create({
      name: "Store Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "admin",
      emailVerifiedAt: new Date(),
      status: "active",
    })
    console.log(`Created admin ${adminEmail}`)
  }

  const media = await mediaLookup()

  for (const product of getCatalog()) {
    await Product.findOneAndUpdate(
      { slug: product.slug },
      {
        slug: product.slug,
        sku: product.id.toUpperCase().replace(/-/g, ""),
        name: product.name,
        displayName: product.displayName,
        tagline: product.tagline,
        description: product.description,
        cardLine: product.cardLine ?? "",
        price: product.price,
        compareAt: product.compareAt,
        netWeight: product.netWeight ?? "",
        stock: 48,
        reserved: 0,
        lowStockThreshold: 8,
        active: true,
        hasDetailPage: product.hasDetailPage,
        isBundle: Boolean(product.isBundle),
        bundleOf: product.bundleOf ?? [],
        categorySlugs: collections.filter((c) => c.ids.includes(product.id)).map((c) => c.slug),
        images: remapImages(product.images, media),
        benefits: product.benefits,
        actives: product.actives,
        howToUse: product.howToUse,
        faqs: product.faqs,
        badges: product.badges,
        kitIncludes: product.kitIncludes ?? [],
        ctaLabel: product.ctaLabel ?? "",
        rating: product.rating,
        reviewCount: product.reviewCount,
      },
      { upsert: true, new: true },
    )
  }

  for (const collection of collections) {
    const products = getCatalog()
    await Category.findOneAndUpdate(
      { slug: collection.slug },
      {
        slug: collection.slug,
        title: collection.title,
        accent: collection.accent,
        eyebrow: collection.eyebrow,
        intro: collection.intro,
        productSlugs: collection.ids
          .map((id) => products.find((p) => p.id === id)?.slug)
          .filter(Boolean),
      },
      { upsert: true },
    )
  }

  await Settings.findOneAndUpdate({ key: "default" }, { key: "default" }, { upsert: true })
  await Coupon.findOneAndUpdate(
    { code: "GLOW10" },
    { code: "GLOW10", type: "percent", value: 10, minSubtotal: 999, maxUses: 0, active: true },
    { upsert: true },
  )

  console.log("Seed complete")
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
