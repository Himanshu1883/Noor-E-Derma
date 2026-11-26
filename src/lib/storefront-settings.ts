export type StorefrontSettings = {
  storeName: string
  tagline: string
  legalName: string
  supportEmail: string
  supportPhone: string
  whatsapp: string
  hours: string
  address: string
  gst: string
  footerNote: string
  announcement: string
  announcementEnabled: boolean
  announcementLink: string
  shippingFee: number
  freeShippingOver: number
  taxPercent: number
  estimatedDelivery: string
  lowStockThreshold: number
  paymentsEnabled: boolean
  codEnabled: boolean
  onlinePaymentsEnabled: boolean
  minOrderAmount: number
  instagramUrl: string
  youtubeUrl: string
  facebookUrl: string
  maintenanceMode: boolean
  maintenanceMessage: string
  newsletterEnabled: boolean
}

export const STORE_DEFAULTS: StorefrontSettings = {
  storeName: "NOOR E DERMA",
  tagline: "Skin That Glows • Confidence That Shows",
  legalName: "Noor E Derma",
  supportEmail: "hello@noorederma.com",
  supportPhone: "",
  whatsapp: "",
  hours: "Monday–Saturday, 10am–7pm IST",
  address: "India",
  gst: "",
  footerNote: "Questions on an order or the ritual — write to us and we will reply in business hours.",
  announcement: "",
  announcementEnabled: false,
  announcementLink: "",
  shippingFee: 99,
  freeShippingOver: 999,
  taxPercent: 0,
  estimatedDelivery: "3–7 days after dispatch",
  lowStockThreshold: 8,
  paymentsEnabled: true,
  codEnabled: true,
  onlinePaymentsEnabled: true,
  minOrderAmount: 0,
  instagramUrl: "",
  youtubeUrl: "",
  facebookUrl: "",
  maintenanceMode: false,
  maintenanceMessage: "We're updating the shop. Please check back shortly.",
  newsletterEnabled: true,
}

function str(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback
}

function num(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function bool(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback
}

export function toStorefrontSettings(raw?: Record<string, unknown> | null): StorefrontSettings {
  const d = STORE_DEFAULTS
  const src = raw ?? {}
  return {
    storeName: str(src.storeName, d.storeName),
    tagline: str(src.tagline, d.tagline),
    legalName: str(src.legalName, d.legalName),
    supportEmail: str(src.supportEmail, d.supportEmail),
    supportPhone: str(src.supportPhone, d.supportPhone),
    whatsapp: str(src.whatsapp, d.whatsapp),
    hours: str(src.hours, d.hours),
    address: str(src.address, d.address),
    gst: str(src.gst, d.gst),
    footerNote: str(src.footerNote, d.footerNote),
    announcement: str(src.announcement, d.announcement),
    announcementEnabled: bool(src.announcementEnabled, d.announcementEnabled),
    announcementLink: str(src.announcementLink, d.announcementLink),
    shippingFee: num(src.shippingFee, d.shippingFee),
    freeShippingOver: num(src.freeShippingOver, d.freeShippingOver),
    taxPercent: num(src.taxPercent, d.taxPercent),
    estimatedDelivery: str(src.estimatedDelivery, d.estimatedDelivery),
    lowStockThreshold: num(src.lowStockThreshold, d.lowStockThreshold),
    paymentsEnabled: bool(src.paymentsEnabled, d.paymentsEnabled),
    codEnabled: bool(src.codEnabled, d.codEnabled),
    onlinePaymentsEnabled: bool(src.onlinePaymentsEnabled, d.onlinePaymentsEnabled),
    minOrderAmount: num(src.minOrderAmount, d.minOrderAmount),
    instagramUrl: str(src.instagramUrl, d.instagramUrl),
    youtubeUrl: str(src.youtubeUrl, d.youtubeUrl),
    facebookUrl: str(src.facebookUrl, d.facebookUrl),
    maintenanceMode: bool(src.maintenanceMode, d.maintenanceMode),
    maintenanceMessage: str(src.maintenanceMessage, d.maintenanceMessage),
    newsletterEnabled: bool(src.newsletterEnabled, d.newsletterEnabled),
  }
}
