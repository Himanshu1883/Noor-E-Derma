/**
 * Storefront reviews shown on product and home pages.
 */

import { ASSETS } from "@/data/config"

export type Review = {
  id: string
  name: string
  initials: string
  city: string
  rating: number
  title: string
  body: string
  productId: string
  verified: boolean
  image?: string
  beforeImage?: string
  afterImage?: string
  /** CSS object-position for photo crops. */
  imagePosition?: string
  imageFit?: "cover" | "contain"
  pairLabels?: boolean
}

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Verified buyer",
    initials: "VB",
    city: "Client result",
    rating: 5,
    title: "Neck tan, visibly softer",
    body: "Sun-tanned neck before the ritual. After one 20-minute leave-on, the tone looks more even and brighter.",
    productId: "tan-eraser",
    verified: true,
    beforeImage: ASSETS.reviewBefore,
    afterImage: ASSETS.reviewAfter,
    imagePosition: "50% 62%",
  },
  {
    id: "r2",
    name: "Rohit S.",
    initials: "RS",
    city: "Pune",
    rating: 5,
    title: "Finally a ritual that includes men",
    body: "The pack says men & women and it shows. Daily Detox in the morning, Tan Eraser when I look dull. No fuss.",
    productId: "daily-detox",
    verified: true,
  },
  {
    id: "r3",
    name: "Meera V.",
    initials: "MV",
    city: "Bengaluru",
    rating: 4,
    title: "Soft, gold-hour glow",
    body: "The face wash feels gentle and the skin looks fresher. Pairing it with Tan Eraser is the move before events.",
    productId: "daily-detox",
    verified: true,
  },
  {
    id: "r4",
    name: "Verified buyer",
    initials: "VB",
    city: "Client result",
    rating: 5,
    title: "Hands: before & after",
    body: "Same 20-minute ritual, both hands. The treated side looks brighter and more even.",
    productId: "tan-eraser",
    verified: true,
    image: ASSETS.reviewBoth,
    imagePosition: "center",
    imageFit: "contain",
    pairLabels: true,
  },
  {
    id: "r5",
    name: "Verified buyer",
    initials: "VB",
    city: "Client result",
    rating: 5,
    title: "Hands, too — face & body",
    body: "Used it on the hands as well. Pack says face and body. Skin looked fresher after the same 20-minute wait.",
    productId: "tan-eraser",
    verified: true,
    image: ASSETS.reviewHands,
    imagePosition: "50% 48%",
  },
  {
    id: "r6",
    name: "Leena D.",
    initials: "LD",
    city: "Chennai",
    rating: 4,
    title: "A calm luxury cleanse",
    body: "Daily Detox is now the only wash on my shelf. Light lather, skin feels rinsed not stripped.",
    productId: "daily-detox",
    verified: true,
  },
]
