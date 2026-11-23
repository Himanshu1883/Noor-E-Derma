import mongoose, { type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, sparse: true, index: true },
    guestId: { type: String, unique: true, sparse: true, index: true },
    lines: {
      type: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
          quantity: { type: Number, required: true, min: 1, max: 20 },
        },
      ],
      default: [],
    },
    couponCode: { type: String, default: "" },
  },
  { timestamps: true },
)

export type CartDoc = HydratedDocument<InferSchemaType<typeof cartSchema>>

export const Cart: Model<CartDoc> = mongoose.models.Cart || mongoose.model<CartDoc>("Cart", cartSchema)
