export type PolicyDoc = {
  slug: string
  title: string
  accent: string
  updated: string
  intro: string
  sections: { heading: string; copy: string[] }[]
}

export const policies: PolicyDoc[] = [
  {
    slug: "shipping",
    title: "Shipping",
    accent: "policy",
    updated: "25 Nov 2026",
    intro: "We ship across India. You will get tracking as soon as the parcel leaves us.",
    sections: [
      {
        heading: "Dispatch",
        copy: [
          "Confirmed orders are packed and handed to the courier within 2–4 business days.",
          "Most pin codes arrive 3–7 days after dispatch. Remote areas can take longer.",
        ],
      },
      {
        heading: "Orders that have left us",
        copy: [
          "Once a parcel is with the courier it cannot be cancelled from the website. Write to hello@noorederma.com with your order ID if you need help.",
        ],
      },
      {
        heading: "Track your parcel",
        copy: [
          "Use Track order with your order ID and the phone number used at checkout. When a courier tracking number is added, it will appear on the same page.",
        ],
      },
    ],
  },
  {
    slug: "refund",
    title: "Refunds &",
    accent: "replacements",
    updated: "25 Nov 2026",
    intro: "Personal-care products are hygiene-sensitive. We replace first when something arrives wrong or damaged.",
    sections: [
      {
        heading: "When we replace",
        copy: [
          "Wrong item delivered.",
          "Damaged, leaked, or broken pack on arrival.",
          "Missing accessory (for kits).",
          "Expired product on arrival.",
        ],
      },
      {
        heading: "How to request",
        copy: [
          "Write to hello@noorederma.com within 72 hours of delivery.",
          "Share your order ID, photos of the product, invoice, inner and outer packaging, batch number, and a short note on the issue.",
          "Please do not use an item you have raised a complaint about.",
        ],
      },
      {
        heading: "What we cannot take back",
        copy: [
          "Opened or used products, except where the item arrived damaged or incorrect.",
          "Requests without invoice or original packaging.",
          "Damage from storage, neglect, or use against on-pack directions.",
          "Change of mind after the parcel is opened — skincare is not resold for hygiene reasons.",
        ],
      },
      {
        heading: "Refunds",
        copy: [
          "Where a refund is approved, it is issued to the original payment method, or by bank transfer for COD. No cash refunds. Approved refunds typically reflect in 5–10 business days.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    accent: "policy",
    updated: "25 Nov 2026",
    intro: "We collect only what we need to fulfil your order and support you.",
    sections: [
      {
        heading: "What we collect",
        copy: [
          "Name, email, phone, shipping address, and order notes when you buy or contact us.",
          "Payment details are handled by the checkout provider. We do not store full card numbers on our servers.",
        ],
      },
      {
        heading: "How we use it",
        copy: [
          "To fulfil orders, send tracking, answer support, and — only if you opt in — email launches and offers.",
          "You can ask us to update or delete your details by writing to hello@noorederma.com.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of",
    accent: "service",
    updated: "25 Nov 2026",
    intro: "By browsing or placing an order you agree to these terms.",
    sections: [
      {
        heading: "Using this website",
        copy: [
          "We may update these terms; the date above will change when we do.",
          "You must be 18 or older, or shop with a parent or guardian, to complete a purchase (Indian Contract Act, 1872).",
        ],
      },
      {
        heading: "Products and claims",
        copy: [
          "Product claims on this site follow on-pack copy. Always read the pack before use and patch-test if you have sensitive skin.",
          "All products shown on this site are Noor E Derma, unless a page says otherwise.",
        ],
      },
      {
        heading: "Law",
        copy: ["These terms are governed by the laws of India."],
      },
    ],
  },
]

export function getPolicy(slug: string) {
  return policies.find((p) => p.slug === slug)
}
