import mongoose, { type InferSchemaType, type Model } from "mongoose"

const categorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    accent: { type: String, default: "" },
    eyebrow: { type: String, default: "Collection" },
    intro: { type: String, default: "" },
    productSlugs: { type: [String], default: [] },
  },
  { timestamps: true },
)

export type CategoryDoc = InferSchemaType<typeof categorySchema> & { _id: mongoose.Types.ObjectId }

export const Category: Model<CategoryDoc> =
  mongoose.models.Category || mongoose.model<CategoryDoc>("Category", categorySchema)
