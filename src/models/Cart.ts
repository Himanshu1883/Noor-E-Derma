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
  { timestamps: true, versionKey: false },
)

export type CartAttrs = InferSchemaType<typeof cartSchema>
export type CartDoc = HydratedDocument<CartAttrs>

export const Cart: Model<CartAttrs> = mongoose.models.Cart || mongoose.model<CartAttrs>("Cart", cartSchema)
