import type { Metadata } from "next"
import { Accordion } from "@/components/Accordion"
import { GoldButton } from "@/components/GoldButton"
import { PageHeader } from "@/components/page/PageHeader"
import { homeFaqs } from "@/data/faq"

export const metadata: Metadata = {
  title: "FAQ",
  description: "How to use Noor E Derma, how often, patch tests, and shipping — design-draft answers.",
}

export default function Page() {
  return (
    <main className="dewy pt-28 pb-24">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        eyebrow="Good to know"
        title="Questions,"
        accent="answered"
        lede="Short answers for the ritual, the pack, and the parcel. Policies have their own pages when you need the fine print."
      />
      <div className="mx-auto mt-12 max-w-3xl px-5 md:px-8">
        <Accordion items={homeFaqs} />
        <div className="mt-10 flex flex-wrap gap-3">
          <GoldButton to="/contact" variant="outline">
            Still stuck? Contact us
          </GoldButton>
          <GoldButton to="/how-to-use">How to use</GoldButton>
        </div>
      </div>
    </main>
  )
}
