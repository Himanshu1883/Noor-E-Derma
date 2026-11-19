import { ASSETS, SHOW_NICONI } from "@/data/config"
import { niconiKit } from "@/data/products"

export type HeroWord = { text: string; accent?: boolean }

export type HeroChip = {
  icon: "timer" | "flask" | "leaf" | "drop" | "sparkle"
  title: string
  sub: string
}

export type HeroSlide = {
  id: string
  kicker: string
  headline: HeroWord[][]
  sub: string
  badge?: string
  benefits: string[]
  image: string
  imagePosition: string
  layout: "text-left" | "text-right"
  partnerBadge?: string
  chips: HeroChip[]
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

export function getHeroSlides(): HeroSlide[] {
  const duo: HeroSlide = {
    id: "glow-duo",
    kicker: "Skin that glows • Confidence that shows",
    headline: [[{ text: "The" }, { text: "Glow", accent: true }], [{ text: "Duo" }]],
    sub: "Erases tan in 20 minutes. Cleanses deeply. Glows daily.",
    badge: "With Glutathione + Kojic Acid",
    benefits: ["Removes Tan", "Brightens Skin", "Evens Skin Tone"],
    image: ASSETS.hero1,
    imagePosition: "84% center",
    layout: "text-left",
    chips: [
      { icon: "timer", title: "20 min", sub: "Erases tan" },
      { icon: "flask", title: "Glutathione + Kojic", sub: "Key actives" },
    ],
    primaryCta: { label: "Shop Now", href: "#shop" },
    secondaryCta: { label: "Explore Details", href: "/product/tan-eraser" },
  }

  const niconi: HeroSlide = {
    id: "niconi",
    kicker: "Partner collection",
    headline: [[{ text: "Gluta-Kojic" }], [{ text: "Spa", accent: true }, { text: "Collection" }]],
    sub: "Lotion, powder, skin polish, brush and bowl: a complete at-home spa ritual.",
    benefits: ["Brightens Skin Tone", "Evens Skin Texture", "Reduces Dark Spots", "Adds Natural Glow"],
    image: ASSETS.hero2,
    imagePosition: "center",
    layout: "text-right",
    partnerBadge: niconiKit.partnerBrand?.label,
    chips: [{ icon: "sparkle", title: "5-piece kit", sub: "NICONI Professional" }],
    primaryCta: { label: "View Collection", href: "#shop" },
  }

  const detox: HeroSlide = {
    id: "daily-detox",
    kicker: "The daily ritual",
    headline: [[{ text: "Daily" }], [{ text: "Detox", accent: true }]],
    sub: "Niacinamide, Vitamin E, BHA and Aloe Vera. Cleanses deeply, refreshes and rejuvenates.",
    badge: "Face Wash • 100 ml",
    benefits: ["Cleanses Deeply", "Refreshes Skin", "Rejuvenates Skin"],
    image: ASSETS.cardDetox,
    imagePosition: "center",
    layout: "text-right",
    chips: [
      { icon: "leaf", title: "Aloe Vera", sub: "Key active" },
      { icon: "drop", title: "Niacinamide + BHA", sub: "Key actives" },
    ],
    primaryCta: { label: "Shop Face Wash", href: "/product/daily-detox-face-wash" },
    secondaryCta: { label: "See the Ritual", href: "#ritual" },
  }

  return [duo, SHOW_NICONI ? niconi : detox]
}
