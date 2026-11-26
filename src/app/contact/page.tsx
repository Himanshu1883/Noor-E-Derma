import type { Metadata } from "next"
import { PageHeader } from "@/components/page/PageHeader"
import { ContactForm } from "@/components/page/ContactForm"
import { StoreReach } from "@/components/page/StoreReach"

export const metadata: Metadata = {
  title: "Contact us",
  description: "Write to Noor E Derma — orders, rituals, and wholesale.",
}

export default function Page() {
  return (
    <main className="dewy pt-28 pb-24">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Support"
        title="Say"
        accent="hello"
        lede="Questions on Tan Eraser, Daily Detox, or an order. We reply in business hours."
      />
      <div className="mx-auto mt-14 grid max-w-7xl gap-6 px-5 md:grid-cols-12 md:px-8">
        <div className="glass rounded-[32px] p-7 md:col-span-7 md:p-10">
          <h2 className="text-2xl font-medium">Write to us</h2>
          <ContactForm />
        </div>
        <StoreReach />
      </div>
    </main>
  )
}
