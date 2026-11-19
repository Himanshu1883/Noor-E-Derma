/**
 * PLACEHOLDER DATA
 * All prices, compare-at prices, ratings, review counts, review copy,
 * ingredient percentages, result statistics, countdown timers, and
 * customer counts are fictional placeholders for this design draft.
 * They are not real commercial figures.
 *
 * Product claims are limited to on-pack copy from the provided artwork.
 */

import { ASSETS, BUNDLE, SHOW_NICONI } from "@/data/config"

export type ProductImage = {
  src: string
  alt: string
  /** CSS object-position, used to show a crop of a wider photo. */
  position?: string
  /** Zoom factor for detail crops of the same artwork. */
  scale?: number
}

export type Benefit = {
  label: string
  detail: string
  icon: "sun" | "sparkles" | "droplet" | "leaf" | "refresh" | "face"
}

export type Active = {
  name: string
  note: string
  percent?: string
}

export type HowToStep = {
  step: number
  title: string
  body: string
}

export type FaqItem = {
  q: string
  a: string
}

export type Product = {
  id: string
  slug: string
  name: string
  displayName: string
  tagline: string
  description: string
  price: number
  compareAt?: number
  netWeight?: string
  rating: number
  reviewCount: number
  images: ProductImage[]
  benefits: Benefit[]
  actives: Active[]
  howToUse: HowToStep[]
  faqs: FaqItem[]
  badges: string[]
  partnerBrand?: {
    name: string
    label: string
  }
  hasDetailPage: boolean
  kitIncludes?: string[]
  isBundle?: boolean
  bundleOf?: string[]
  ctaLabel?: string
  /** Short one-liner for product cards; falls back to tagline. */
  cardLine?: string
}

export const tanEraser: Product = {
  id: "tan-eraser",
  slug: "tan-eraser",
  name: "Tan Eraser",
  displayName: "TAN ERASER",
  tagline: "For Sun Tanned & Dull Looking Skin",
  description:
    "A Noor E Derma face & body treatment with glutathione + kojic acid, formulated to help remove the look of tan, brighten skin and even skin tone. On-pack claim: erases tan in 20 minutes.",
  price: 1299,
  compareAt: 1799,
  netWeight: "210ml",
  rating: 4.8,
  reviewCount: 128,
  images: [
    { src: ASSETS.cardTan, alt: "Noor E Derma Tan Eraser box" },
    { src: ASSETS.hero1, alt: "Tan Eraser on a marble counter", position: "42% center" },
    { src: ASSETS.cardTan, alt: "Tan Eraser key actives detail", position: "50% 52%", scale: 1.9 },
  ],
  benefits: [
    { label: "Removes Tan", detail: "On-pack benefit for sun-tanned, dull-looking skin.", icon: "sun" },
    { label: "Brightens Skin", detail: "Helps reveal a brighter-looking complexion.", icon: "sparkles" },
    { label: "Evens Skin Tone", detail: "Supports a more even-looking skin tone.", icon: "droplet" },
  ],
  actives: [
    { name: "Glutathione", note: "Featured on pack with kojic acid.", percent: "2%" },
    { name: "Kojic Acid", note: "Paired with glutathione on the Tan Eraser pack.", percent: "1%" },
  ],
  howToUse: [
    { step: 1, title: "Cleanse", body: "Start with a clean face or body using Daily Detox Face Wash." },
    { step: 2, title: "Apply", body: "Smooth an even layer of Tan Eraser over sun-tanned or dull-looking areas." },
    { step: 3, title: "Wait 20 minutes", body: "Leave on as directed on pack — erases tan in 20 minutes." },
    { step: 4, title: "Rinse", body: "Rinse with lukewarm water and pat dry." },
    { step: 5, title: "Glow", body: "Follow with moisturiser. Use sunscreen in the day." },
  ],
  faqs: [
    {
      q: "How do I use Tan Eraser?",
      a: "Apply an even layer on cleansed, sun-tanned or dull-looking skin, leave on for 20 minutes, then rinse. For face and body, as on pack.",
    },
    {
      q: "How often can I use it?",
      a: "Use as needed when skin looks sun-tanned or dull. Always patch test first. This draft does not replace on-pack directions.",
    },
    {
      q: "Is it for men and women?",
      a: "Yes. The pack states Face & Body | Men & Women.",
    },
  ],
  badges: ["Face & Body", "Men & Women", "Glutathione + Kojic Acid"],
  hasDetailPage: true,
}

export const dailyDetox: Product = {
  id: "daily-detox",
  slug: "daily-detox-face-wash",
  name: "Daily Detox Face Wash",
  displayName: "DAILY DETOX",
  tagline: "Face Wash",
  cardLine: "With Niacinamide, Vitamin E, BHA & Aloe Vera",
  description:
    "A daily face wash with niacinamide, vitamin E, BHA and aloe vera. On-pack benefits: cleanses deeply, refreshes skin, rejuvenates skin.",
  price: 449,
  compareAt: 599,
  netWeight: "100 ml",
  rating: 4.8,
  reviewCount: 96,
  images: [
    { src: ASSETS.cardDetox, alt: "Noor E Derma Daily Detox Face Wash box" },
    { src: ASSETS.hero1, alt: "Daily Detox on a marble counter", position: "80% center" },
    { src: ASSETS.cardDetox, alt: "Daily Detox key actives detail", position: "40% 64%", scale: 1.9 },
  ],
  benefits: [
    { label: "Cleanses Deeply", detail: "On-pack benefit for a thorough daily cleanse.", icon: "droplet" },
    { label: "Refreshes Skin", detail: "Leaves skin feeling refreshed.", icon: "refresh" },
    { label: "Rejuvenates Skin", detail: "A finishing on-pack promise of rejuvenated-looking skin.", icon: "sparkles" },
  ],
  actives: [
    { name: "Niacinamide", note: "Listed as a key active on pack.", percent: "4%" },
    { name: "Vitamin E", note: "Listed as a key active on pack.", percent: "1%" },
    { name: "BHA", note: "Listed as a key active on pack.", percent: "1%" },
    { name: "Aloe Vera", note: "Listed as a key active on pack.", percent: "3%" },
  ],
  howToUse: [
    { step: 1, title: "Wet", body: "Splash face with lukewarm water." },
    { step: 2, title: "Cleanse", body: "Work a small amount into a light lather. Massage for 30–60 seconds." },
    { step: 3, title: "Rinse", body: "Rinse thoroughly and pat dry." },
    { step: 4, title: "Follow", body: "Continue with Tan Eraser when treating dull, sun-tanned skin." },
  ],
  faqs: [
    {
      q: "Is Daily Detox for all skin types?",
      a: "It is designed as a daily face wash. Patch test if you have sensitive skin. Follow the on-pack directions.",
    },
    {
      q: "Can men use it?",
      a: "Yes — the Noor E Derma ritual is for men and women.",
    },
    {
      q: "How often should I use it?",
      a: "Morning and evening, or as needed. This is placeholder guidance for the design draft.",
    },
  ],
  badges: ["Key actives: Niacinamide, Vitamin E, BHA, Aloe Vera"],
  hasDetailPage: true,
}

export const niconiKit: Product = {
  id: "niconi-gluta-kojic",
  slug: "niconi-gluta-kojic-spa",
  name: "Gluta-Kojic Spa Collection",
  displayName: "GLUTA-KOJIC SPA COLLECTION",
  tagline: "Partner brand: NICONI Professional",
  description:
    "A NICONI Professional kit with Gluta-Kojic Lotion, Powder and Skin Polish, plus an applicator brush and mixing bowl. Packaging claims: with glutathione, kojic acid, vitamin C, niacinamide and AHA — brightens skin tone, evens skin texture, reduces dark spots, adds natural glow.",
  price: 1999,
  rating: 4.7,
  reviewCount: 64,
  images: [
    { src: ASSETS.cardNiconi, alt: "NICONI Professional Gluta-Kojic Spa Collection" },
    { src: ASSETS.hero2, alt: "NICONI Gluta-Kojic kit flat lay" },
  ],
  benefits: [
    { label: "Brightens Skin Tone", detail: "On-pack claim from NICONI Professional.", icon: "sparkles" },
    { label: "Evens Skin Texture", detail: "On-pack claim from NICONI Professional.", icon: "droplet" },
    { label: "Reduces Dark Spots", detail: "On-pack claim from NICONI Professional.", icon: "sun" },
    { label: "Adds Natural Glow", detail: "On-pack claim from NICONI Professional.", icon: "leaf" },
  ],
  actives: [
    { name: "Glutathione", note: "Listed on NICONI Gluta-Kojic packaging." },
    { name: "Kojic Acid", note: "Listed on NICONI Gluta-Kojic packaging." },
    { name: "Vitamin C", note: "Listed on NICONI Gluta-Kojic packaging." },
    { name: "Niacinamide", note: "Listed on NICONI Gluta-Kojic packaging." },
    { name: "AHA", note: "Listed on NICONI Gluta-Kojic packaging." },
  ],
  howToUse: [
    { step: 1, title: "Polish", body: "Use Gluta-Kojic Skin Polish as directed on the NICONI pack." },
    { step: 2, title: "Mix", body: "Prepare Gluta-Kojic Powder in the bowl with the applicator brush." },
    { step: 3, title: "Treat", body: "Follow with Gluta-Kojic Lotion for brighter, even-toned looking skin." },
  ],
  faqs: [
    {
      q: "Is this a Noor E Derma product?",
      a: "No. This is a partner-brand kit from NICONI Professional. Trademarks belong to their owners.",
    },
  ],
  badges: ["Partner brand: NICONI Professional"],
  partnerBrand: {
    name: "NICONI Professional",
    label: "Partner brand: NICONI Professional",
  },
  hasDetailPage: false,
  cardLine: "Lotion, powder, polish, brush & bowl",
  kitIncludes: [
    "Gluta-Kojic Lotion",
    "Gluta-Kojic Powder",
    "Gluta-Kojic Skin Polish",
    "Applicator brush",
    "Mixing bowl",
  ],
}

export const glowDuo: Product = {
  id: BUNDLE.id,
  slug: "glow-duo",
  name: BUNDLE.name,
  displayName: "THE GLOW DUO",
  tagline: "Tan Eraser + Daily Detox",
  cardLine: "Tan Eraser + Daily Detox, together for less",
  description:
    "The Noor E Derma pairing: Tan Eraser (210ml) with Daily Detox Face Wash (100ml). Cleanse, erase, glow.",
  price: BUNDLE.price,
  compareAt: BUNDLE.compareAt,
  rating: 4.9,
  reviewCount: 42,
  images: [
    { src: ASSETS.hero1, alt: "Noor E Derma Glow Duo — Tan Eraser and Daily Detox", position: "62% center" },
    { src: ASSETS.cardTan, alt: "Tan Eraser" },
    { src: ASSETS.cardDetox, alt: "Daily Detox Face Wash" },
  ],
  benefits: [
    { label: "Removes Tan", detail: "From Tan Eraser on-pack copy.", icon: "sun" },
    { label: "Cleanses Deeply", detail: "From Daily Detox on-pack copy.", icon: "droplet" },
    { label: "Daily Glow", detail: "A complete two-step ritual.", icon: "sparkles" },
  ],
  actives: [
    { name: "Glutathione + Kojic Acid", note: "Tan Eraser" },
    { name: "Niacinamide, Vitamin E, BHA, Aloe Vera", note: "Daily Detox" },
  ],
  howToUse: tanEraser.howToUse,
  faqs: [],
  badges: ["Limited launch offer"],
  hasDetailPage: false,
  isBundle: true,
  bundleOf: [tanEraser.id, dailyDetox.id],
}

export const noorProducts = [tanEraser, dailyDetox]

export function getCatalog(): Product[] {
  return SHOW_NICONI ? [...noorProducts, niconiKit] : [...noorProducts, glowDuo]
}

export function getFeaturedProducts(): Product[] {
  return getCatalog()
}

export function getProductBySlug(slug: string): Product | undefined {
  return [tanEraser, dailyDetox, niconiKit, glowDuo].find((p) => p.slug === slug)
}

export function getDetailProduct(slug: string): Product | undefined {
  const product = getProductBySlug(slug)
  if (!product?.hasDetailPage) return undefined
  return product
}
