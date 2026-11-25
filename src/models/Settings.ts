import mongoose, { type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "default", unique: true },
    storeName: { type: String, default: "NOOR E DERMA" },
    supportEmail: { type: String, default: "hello@noorederma.com" },
    supportPhone: { type: String, default: "" },
    shippingFee: { type: Number, default: 99 },
    freeShippingOver: { type: Number, default: 999 },
    taxPercent: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 8 },
    announcement: { type: String, default: "" },
    paymentsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export type SettingsAttrs = InferSchemaType<typeof settingsSchema>
export type SettingsDoc = HydratedDocument<SettingsAttrs>

export const Settings: Model<SettingsAttrs> =
  mongoose.models.Settings || mongoose.model<SettingsAttrs>("Settings", settingsSchema)
