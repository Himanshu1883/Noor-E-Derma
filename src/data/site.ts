/**
 * Storefront copy for the multi-page shop.
 */

export const COMPANY = {
  legalName: "Noor E Derma",
  tagline: "Skin That Glows • Confidence That Shows",
  email: "hello@noorederma.com",
  phone: "",
  whatsapp: "",
  hours: "Monday–Saturday, 10am–7pm IST",
  address: ["India"],
  gst: "",
  note: "Questions on an order or the ritual — write to us and we will reply in business hours.",
} as const

export const NAV_PRIMARY = [
  { label: "Shop All", href: "/shop" },
  { label: "Tan Eraser", href: "/product/tan-eraser" },
  { label: "Face Wash", href: "/product/daily-detox-face-wash" },
  { label: "Combos", href: "/shop/combos" },
  { label: "How to use", href: "/how-to-use" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const

export const NAV_MORE = [
  { label: "Ritual Kit", href: "/product/tan-eraser-kit" },
  { label: "About", href: "/about" },
  { label: "Track order", href: "/track-order" },
  { label: "FAQ", href: "/faq" },
] as const

export const FOOTER_SHOP = [
  { label: "Shop all", href: "/shop" },
  { label: "Tan Eraser", href: "/product/tan-eraser" },
  { label: "Ritual Kit", href: "/product/tan-eraser-kit" },
  { label: "Daily Detox", href: "/product/daily-detox-face-wash" },
  { label: "The Glow Duo", href: "/product/glow-duo" },
  { label: "Combos", href: "/shop/combos" },
] as const

export const FOOTER_COMPANY = [
  { label: "Our story", href: "/about" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "Journal", href: "/blog" },
] as const

export const FOOTER_SUPPORT = [
  { label: "How to use", href: "/how-to-use" },
  { label: "Track order", href: "/track-order" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
] as const

export const FOOTER_POLICIES = [
  { label: "Shipping", href: "/policies/shipping" },
  { label: "Refunds", href: "/policies/refund" },
  { label: "Privacy", href: "/policies/privacy" },
  { label: "Terms", href: "/policies/terms" },
] as const
