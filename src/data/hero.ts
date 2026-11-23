import { ASSETS } from "@/data/config"

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
    primaryCta: { label: "Shop Now", href: "/shop" },
    secondaryCta: { label: "Explore Details", href: "/product/tan-eraser" },
  }

  const kit: HeroSlide = {
    id: "tan-eraser-kit",
    kicker: "The complete ritual",
    headline: [[{ text: "Tan" }], [{ text: "Eraser", accent: true }, { text: "Kit" }]],
    sub: "Lotion, travel, jar, brush and bowl — the at-home tan ritual. Cleanses, exfoliates, brightens, nourishes, smoothens.",
    benefits: ["Cleanses", "Exfoliates", "Brightens", "Nourishes", "Smoothens"],
    image: ASSETS.kitTan,
    imagePosition: "center",
    layout: "text-right",
    chips: [{ icon: "sparkle", title: "5-piece kit", sub: "Noor E Derma" }],
    primaryCta: { label: "View the kit", href: "/product/tan-eraser-kit" },
    secondaryCta: { label: "Shop all", href: "/shop" },
  }

  return [duo, kit]
}
