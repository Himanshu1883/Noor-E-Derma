import mongoose, { type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const imageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, default: "" },
    position: { type: String },
    scale: { type: Number },
    type: { type: String, enum: ["image", "video"], default: "image" },
    poster: { type: String },
    fileId: { type: String },
  },
  { _id: false },
)

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    displayName: { type: String, default: "" },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    cardLine: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAt: { type: Number, min: 0 },
    netWeight: { type: String, default: "" },
    stock: { type: Number, required: true, min: 0, default: 0 },
    reserved: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 8 },
    active: { type: Boolean, default: true, index: true },
    hasDetailPage: { type: Boolean, default: true },
    isBundle: { type: Boolean, default: false },
    bundleOf: { type: [String], default: [] },
    categorySlugs: { type: [String], default: [], index: true },
    images: { type: [imageSchema], default: [] },
    benefits: { type: [{ label: String, detail: String, icon: String }], default: [] },
    actives: { type: [{ name: String, note: String, percent: String }], default: [] },
    howToUse: { type: [{ step: Number, title: String, body: String }], default: [] },
    faqs: { type: [{ q: String, a: String }], default: [] },
    badges: { type: [String], default: [] },
    kitIncludes: { type: [String], default: [] },
    ctaLabel: { type: String, default: "" },
    customFields: {
      type: [
        new mongoose.Schema(
          {
            label: { type: String, default: "" },
            value: { type: String, default: "" },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

productSchema.index({ name: "text", tagline: "text", description: "text" })

export type ProductAttrs = InferSchemaType<typeof productSchema>
export type ProductDoc = HydratedDocument<ProductAttrs>

export const Product: Model<ProductAttrs> =
  mongoose.models.Product || mongoose.model<ProductAttrs>("Product", productSchema)
