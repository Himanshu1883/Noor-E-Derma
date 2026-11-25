import type { Metadata } from "next"
import { PageHeader } from "@/components/page/PageHeader"
import { Ingredients } from "@/sections/Ingredients"

export const metadata: Metadata = {
  title: "Ingredients",
  description: "Niacinamide, BHA, glutathione, kojic acid, vitamin E, and aloe vera — as printed on Noor E Derma packs.",
}

export default function Page() {
  return (
    <main className="dewy pt-28 pb-8">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Ingredients" }]}
        eyebrow="Clean science"
        title="What is"
        accent="inside"
        lede="Named actives from the packs. Decorative molecules are illustrative, not exact chemistry."
      />
      <Ingredients />
    </main>
  )
}
