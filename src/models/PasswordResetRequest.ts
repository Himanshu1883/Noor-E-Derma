import mongoose, { type InferSchemaType, type Model } from "mongoose"

const passwordResetRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    name: { type: String, default: "" },
    status: { type: String, enum: ["pending", "sent", "completed"], default: "pending", index: true },
    requestedAt: { type: Date, default: Date.now },
    sentAt: { type: Date },
    usedAt: { type: Date },
    sendCount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export type PasswordResetRequestDoc = InferSchemaType<typeof passwordResetRequestSchema> & { _id: mongoose.Types.ObjectId }

delete mongoose.models.PasswordResetRequest

export const PasswordResetRequest: Model<PasswordResetRequestDoc> =
  mongoose.model<PasswordResetRequestDoc>("PasswordResetRequest", passwordResetRequestSchema)
