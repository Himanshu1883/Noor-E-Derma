import type { Metadata } from "next"
import { PageHeader } from "@/components/page/PageHeader"
import { ContactForm } from "@/components/page/ContactForm"
import { COMPANY } from "@/data/site"

export const metadata: Metadata = {
  title: "Contact us",
  description: "Write to Noor E Derma — orders, rituals, and wholesale. Placeholder contact details for this design draft.",
}

export default function Page() {
  return (
    <main className="dewy pt-28 pb-24">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Support"
        title="Say"
        accent="hello"
        lede="Questions on Tan Eraser, Daily Detox, or an order. We reply in business hours. Details below are placeholders until launch."
      />
      <div className="mx-auto mt-14 grid max-w-7xl gap-6 px-5 md:grid-cols-12 md:px-8">
        <div className="glass rounded-[32px] p-7 md:col-span-7 md:p-10">
          <h2 className="text-2xl font-medium">Write to us</h2>
          <ContactForm />
        </div>
        <aside className="space-y-4 md:col-span-5">
          <div className="glass rounded-[32px] p-7">
            <p className="eyebrow">Hours</p>
            <p className="mt-3 text-lg">{COMPANY.hours}</p>
            <p className="mt-4 text-sm text-ink/60">High-volume weeks can slow deliveries. We will keep this notice honest when the store is live.</p>
          </div>
          <div className="glass rounded-[32px] p-7">
            <p className="eyebrow">Reach</p>
            <ul className="mt-4 space-y-2 text-ink/75">
              <li>Email · {COMPANY.email}</li>
              <li>WhatsApp · {COMPANY.whatsapp}</li>
              <li>Phone · {COMPANY.phone}</li>
            </ul>
            <p className="mt-4 text-[12px] text-ink/45">{COMPANY.note}</p>
          </div>
        </aside>
      </div>
    </main>
  )
}
