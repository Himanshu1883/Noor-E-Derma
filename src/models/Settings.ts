import mongoose, { type HydratedDocument, type InferSchemaType, type Model } from "mongoose"

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "default", unique: true },
    storeName: { type: String, default: "NOOR E DERMA" },
    tagline: { type: String, default: "Skin That Glows • Confidence That Shows" },
    legalName: { type: String, default: "Noor E Derma" },
    supportEmail: { type: String, default: "hello@noorederma.com" },
    supportPhone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    hours: { type: String, default: "Monday–Saturday, 10am–7pm IST" },
    address: { type: String, default: "India" },
    gst: { type: String, default: "" },
    footerNote: { type: String, default: "Questions on an order or the ritual — write to us and we will reply in business hours." },
    announcement: { type: String, default: "" },
    announcementEnabled: { type: Boolean, default: false },
    announcementLink: { type: String, default: "" },
    shippingFee: { type: Number, default: 99 },
    freeShippingOver: { type: Number, default: 999 },
    taxPercent: { type: Number, default: 0 },
    estimatedDelivery: { type: String, default: "3–7 days after dispatch" },
    lowStockThreshold: { type: Number, default: 8 },
    paymentsEnabled: { type: Boolean, default: true },
    codEnabled: { type: Boolean, default: true },
    onlinePaymentsEnabled: { type: Boolean, default: true },
    minOrderAmount: { type: Number, default: 0 },
    instagramUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: "We're updating the shop. Please check back shortly." },
    newsletterEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export type SettingsAttrs = InferSchemaType<typeof settingsSchema>
export type SettingsDoc = HydratedDocument<SettingsAttrs>

delete mongoose.models.Settings

export const Settings: Model<SettingsAttrs> = mongoose.model<SettingsAttrs>("Settings", settingsSchema)
