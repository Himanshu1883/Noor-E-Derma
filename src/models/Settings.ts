import mongoose, { type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "default", unique: true },
    storeName: { type: String, default: "NOOR E DERMA" },
    supportEmail: { type: String, default: "hello@noorederma.example" },
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

export type SettingsDoc = HydratedDocument<InferSchemaType<typeof settingsSchema>>

export const Settings: Model<SettingsDoc> =
  mongoose.models.Settings || mongoose.model<SettingsDoc>("Settings", settingsSchema)
