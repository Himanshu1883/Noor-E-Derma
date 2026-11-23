import mongoose, { type InferSchemaType, type Model } from "mongoose"

const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    productIds: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], default: [] },
  },
  { timestamps: true },
)

export type WishlistDoc = InferSchemaType<typeof wishlistSchema> & { _id: mongoose.Types.ObjectId }

export const Wishlist: Model<WishlistDoc> =
  mongoose.models.Wishlist || mongoose.model<WishlistDoc>("Wishlist", wishlistSchema)
