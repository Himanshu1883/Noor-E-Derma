import type { Metadata } from "next"
import { PageHeader } from "@/components/page/PageHeader"
import { TrackForm } from "@/components/page/TrackForm"

export const metadata: Metadata = {
  title: "Track order",
  description: "Track a Noor E Derma order with your order ID and checkout phone number.",
}

export default function Page() {
  return (
    <main className="dewy pt-28 pb-24">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Track order" }]}
        eyebrow="Orders"
        title="Track"
        accent="your order"
        lede="Enter the order ID and the phone number used at checkout."
      />
      <div className="mx-auto mt-14 max-w-xl px-5 md:px-8">
        <div className="glass rounded-[32px] p-7 md:p-10">
          <TrackForm />
        </div>
      </div>
    </main>
  )
}
