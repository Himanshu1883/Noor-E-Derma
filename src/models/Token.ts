import mongoose, { type InferSchemaType, type Model } from "mongoose"

const tokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["email_verify", "password_reset"], required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
)

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export type TokenDoc = InferSchemaType<typeof tokenSchema> & { _id: mongoose.Types.ObjectId }

export const Token: Model<TokenDoc> = mongoose.models.Token || mongoose.model<TokenDoc>("Token", tokenSchema)
