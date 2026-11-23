import { mediaUrl } from "@/data/media-map"

export const BRAND = {
  name: "NOOR E DERMA",
  tagline: "Skin That Glows • Confidence That Shows",
  shortTagline: "SKIN THAT GLOWS • CONFIDENCE THAT SHOWS",
} as const

export const DRAFT_LABEL = "Draft v2"

/** "a" = champagne marble editorial, "c" = ivory sage & glass. Visitors can switch with the on-page toggle. */
export type ThemeId = "a" | "c"
export const DEFAULT_THEME: ThemeId = "a"
export const THEMES: { id: ThemeId; label: string }[] = [
  { id: "a", label: "Variant A" },
  { id: "c", label: "Variant C" },
]

/** Placeholder launch window for the CTA countdown. */
export const LAUNCH_OFFER_ENDS = "2026-12-01T23:59:59+05:30"

export const BUNDLE = {
  id: "glow-duo",
  name: "The Glow Duo",
  price: 1599,
  compareAt: 1748,
} as const

export const ASSETS = {
  logo: mediaUrl("/assets/logo-nd.png"),
  hero1: mediaUrl("/assets/hero-1-noor-duo.jpg"),
  hero2: mediaUrl("/assets/tan-eraser-kit.jpg"),
  cardTan: mediaUrl("/assets/card-tan-eraser.jpg"),
  cardDetox: mediaUrl("/assets/card-daily-detox.jpg"),
  kitTan: mediaUrl("/assets/tan-eraser-kit.jpg"),
  videoTan: mediaUrl("/assets/tan_eraser.mp4"),
}
