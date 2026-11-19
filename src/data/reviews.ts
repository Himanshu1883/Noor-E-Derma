/**
 * PLACEHOLDER reviews and ratings for the design draft only.
 */

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
}

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Ayesha K.",
    initials: "AK",
    city: "Mumbai",
    rating: 5,
    title: "My post-holiday ritual",
    body: "Used Tan Eraser after a beach week. Skin looked brighter and more even by the evening. The 20-minute wait is easy to build into a Sunday reset.",
    productId: "tan-eraser",
    verified: true,
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
    name: "Fatima N.",
    initials: "FN",
    city: "Hyderabad",
    rating: 5,
    title: "Dull skin, meet light",
    body: "I wanted something that felt luxurious without looking gimmicky. The gold packaging is gorgeous and the skin looks more even.",
    productId: "tan-eraser",
    verified: true,
  },
  {
    id: "r5",
    name: "Arjun P.",
    initials: "AP",
    city: "Delhi",
    rating: 5,
    title: "Cleanse, erase, go",
    body: "Simple two-step. Face wash in the shower, Tan Eraser when I have twenty minutes. Skin looks less tired.",
    productId: "tan-eraser",
    verified: true,
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
