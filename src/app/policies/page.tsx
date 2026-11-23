import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/PageHeader"
import { policies } from "@/data/policies"

export const metadata: Metadata = {
  title: "Policies",
  description: "Shipping, refunds, privacy, and terms for the Noor E Derma design draft.",
}

export default function Page() {
  return (
    <main className="dewy pt-28 pb-24">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Policies" }]}
        eyebrow="Fine print"
        title="Store"
        accent="policies"
        lede="Placeholder documents for this design draft. Final legal copy ships with the live backend."
      />
      <div className="mx-auto mt-12 grid max-w-7xl gap-4 px-5 sm:grid-cols-2 md:px-8">
        {policies.map((doc) => (
          <Link key={doc.slug} href={`/policies/${doc.slug}`} className="glass rounded-[28px] p-6 transition hover:-translate-y-0.5">
            <h2 className="text-2xl font-medium">
              {doc.title} <span className="gold-text italic">{doc.accent}</span>
            </h2>
            <p className="mt-2 text-sm text-ink/60">{doc.intro}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
