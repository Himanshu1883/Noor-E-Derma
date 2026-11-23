export type PolicyDoc = {
  slug: string
  title: string
  accent: string
  updated: string
  intro: string
  sections: { heading: string; copy: string[] }[]
}

const draft =
  "This is placeholder policy copy for the Noor E Derma design draft. Final legal language will be confirmed before the live store opens."

export const policies: PolicyDoc[] = [
  {
    slug: "shipping",
    title: "Shipping",
    accent: "policy",
    updated: "Draft · Nov 2026",
    intro: draft,
    sections: [
      {
        heading: "Dispatch",
        copy: [
          "Once an order is confirmed, we aim to dispatch within 2–4 business days. You will receive an email with the courier name and tracking number when the parcel leaves us.",
          "Delivery estimates in this draft: 3–5 days after dispatch for most pin codes. Remote pin codes may take longer.",
        ],
      },
      {
        heading: "Orders that have left us",
        copy: [
          "Orders that have already been dispatched cannot be cancelled from the website. If you need help, write to hello@noorederma.example with your order ID.",
        ],
      },
      {
        heading: "Track your parcel",
        copy: ["Use the Track order page with your order ID and the phone number used at checkout. Live courier lookup will be connected when the backend is set up."],
      },
    ],
  },
  {
    slug: "refund",
    title: "Refunds &",
    accent: "replacements",
    updated: "Draft · Nov 2026",
    intro: "Personal-care products are hygiene-sensitive. This draft follows a replacement-first pattern common to Indian skincare stores.",
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
          "Write to hello@noorederma.example within 24–72 hours of delivery.",
          "Share: order ID, photos of the product, invoice, inner and outer packaging, and batch number, plus a short note on the issue.",
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
          "Where a refund is approved, it is issued to the original payment method (or bank transfer for COD). No cash refunds. Draft timing: 5–10 business days after approval.",
          draft,
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    accent: "policy",
    updated: "Draft · Nov 2026",
    intro: draft,
    sections: [
      {
        heading: "What we may collect",
        copy: [
          "Name, email, phone, shipping address, and order notes when you buy or contact us.",
          "Payment details are handled by the checkout provider — we do not intend to store full card numbers on our own servers.",
        ],
      },
      {
        heading: "How we use it",
        copy: [
          "To fulfil orders, send tracking, answer support, and (only if you opt in) email launches and offers.",
          "You can ask us to update or delete your details by writing to hello@noorederma.example.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of",
    accent: "service",
    updated: "Draft · Nov 2026",
    intro: draft,
    sections: [
      {
        heading: "Using this website",
        copy: [
          "By browsing or placing an order you agree to these draft terms. We may update them; the date above will change when we do.",
          "You must be 18 or older, or shop with a parent or guardian, to complete a purchase (Indian Contract Act, 1872).",
        ],
      },
      {
        heading: "Products and claims",
        copy: [
          "Product claims on this site are limited to on-pack copy. Prices, ratings, and launch offers in this draft are placeholders.",
          "All products shown on this site are Noor E Derma, unless a page says otherwise.",
        ],
      },
      {
        heading: "Law",
        copy: ["These draft terms are intended to be read under the laws of India. The governing city will be confirmed with the live legal entity."],
      },
    ],
  },
]

export function getPolicy(slug: string) {
  return policies.find((p) => p.slug === slug)
}
