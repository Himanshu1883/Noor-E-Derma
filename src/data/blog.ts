export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  read: string
  related?: string[]
  body: { heading?: string; copy: string }[]
}

export const posts: BlogPost[] = [
  {
    slug: "what-is-tanning",
    title: "What is tanning — and why skin looks dull after the sun",
    excerpt: "A plain-language look at sun tan, dullness, and how a 20-minute ritual sits next to daily cleansing.",
    date: "31 Oct 2026",
    category: "Skin school",
    read: "4 min",
    related: ["tan-eraser"],
    body: [
      {
        copy: "Tanning is the skin’s visible response to the sun. After a beach week, a wedding outdoors, or a long commute, skin can look darker, duller, and less even. That look is what Tan Eraser is packed for: sun-tanned and dull-looking skin, on face and body, for men and women.",
      },
      {
        heading: "Tan vs. your everyday glow",
        copy: "Daily dullness and a holiday tan are not the same, but they often show up together. Daily Detox Face Wash is the everyday cleanse — niacinamide, vitamin E, BHA and aloe vera, to cleanse deeply, refresh and rejuvenate. Tan Eraser is the targeted step: glutathione + kojic acid, leave on 20 minutes, then rinse.",
      },
      {
        heading: "A calm way to start",
        copy: "Patch test first. Use as directed on pack. Follow with moisturiser, and daytime sunscreen after any tan-care ritual. This journal is educational — it is not a medical claim and does not replace on-pack directions.",
      },
    ],
  },
  {
    slug: "how-to-choose-a-de-tan-ritual",
    title: "How to choose a de-tan ritual for face and body",
    excerpt: "Face, body, men, women: what to look for on the pack before you add a treatment to your shelf.",
    date: "26 Sep 2026",
    category: "Rituals",
    read: "5 min",
    related: ["tan-eraser", "glow-duo"],
    body: [
      {
        copy: "A good tan-care ritual is easy to read on the box. Look for who it is for, where it goes, how long it stays on, and which actives sit on the front of pack.",
      },
      {
        heading: "What we print on Tan Eraser",
        copy: "Face & Body. Men & Women. For sun-tanned and dull-looking skin. With glutathione + kojic acid. Erases tan in 20 minutes. Those lines are the whole brief — we do not add extra clinical promises beyond the pack.",
      },
      {
        heading: "Pair it with a daily wash",
        copy: "Start clean. Daily Detox Face Wash (100 ml) is the prep step. The Glow Duo bundles both so the ritual lives in one order. If you only need a cleanse, shop the wash alone.",
      },
    ],
  },
  {
    slug: "twenty-minute-tan-eraser",
    title: "The 20-minute Tan Eraser ritual, step by step",
    excerpt: "Cleanse, apply, wait, rinse, glow — the exact sequence we show on How to use, written out for a Sunday reset.",
    date: "12 Sep 2026",
    category: "How to use",
    read: "3 min",
    related: ["tan-eraser", "daily-detox"],
    body: [
      {
        copy: "Set a timer. Tan Eraser is built around twenty minutes — the on-pack line is “erases tan in 20 minutes.” Here is the sequence we recommend.",
      },
      {
        heading: "The steps",
        copy: "1. Cleanse with Daily Detox. 2. Smooth an even layer of Tan Eraser on sun-tanned or dull-looking areas. 3. Leave on for 20 minutes. 4. Rinse with lukewarm water and pat dry. 5. Moisturise; wear sunscreen in the day.",
      },
      {
        heading: "Who it is for",
        copy: "The pack says Face & Body | Men & Women. If skin is sensitive, patch test on the inner arm first and continue only if the skin stays comfortable.",
      },
    ],
  },
  {
    slug: "daily-detox-actives",
    title: "Inside Daily Detox: niacinamide, BHA, vitamin E, aloe",
    excerpt: "A clean-science walkthrough of the four key actives printed on the Daily Detox Face Wash pack.",
    date: "2 Sep 2026",
    category: "Ingredients",
    read: "4 min",
    related: ["daily-detox"],
    body: [
      {
        copy: "Daily Detox Face Wash lists four key actives on pack: niacinamide, vitamin E, BHA and aloe vera. On-pack benefits: cleanses deeply, refreshes skin, rejuvenates skin.",
      },
      {
        heading: "How it sits in the ritual",
        copy: "Morning and evening, or as needed. Wet, lather 30–60 seconds, rinse. When skin looks sun-tanned or dull, continue with Tan Eraser. That pairing is the Glow Duo.",
      },
    ],
  },
]

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}
