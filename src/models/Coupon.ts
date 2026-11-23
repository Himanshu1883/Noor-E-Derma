import mongoose, { type InferSchemaType, type Model } from "mongoose"

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    minSubtotal: { type: Number, default: 0 },
    maxUses: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
    active: { type: Boolean, default: true },
    firstOrderOnly: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export type CouponDoc = InferSchemaType<typeof couponSchema> & { _id: mongoose.Types.ObjectId }

export const Coupon: Model<CouponDoc> = mongoose.models.Coupon || mongoose.model<CouponDoc>("Coupon", couponSchema)
