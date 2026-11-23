import mongoose, { type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
)

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String },
    googleId: { type: String, index: true, sparse: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer", index: true },
    phone: { type: String, default: "" },
    emailVerifiedAt: { type: Date },
    status: { type: String, enum: ["active", "disabled"], default: "active", index: true },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    lastLoginAt: { type: Date },
    addresses: { type: [addressSchema], default: [] },
  },
  { timestamps: true },
)

export type UserDoc = HydratedDocument<InferSchemaType<typeof userSchema>>

export const User: Model<UserDoc> = mongoose.models.User || mongoose.model<UserDoc>("User", userSchema)
