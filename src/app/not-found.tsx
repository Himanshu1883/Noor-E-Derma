import { GoldButton } from "@/components/GoldButton"
import { PageHeader } from "@/components/page/PageHeader"

export default function NotFound() {
  return (
    <main className="dewy pt-28 pb-24">
      <PageHeader
        eyebrow="404"
        title="This page has"
        accent="wandered"
        lede="The ritual is still here. Try the shop, or go home."
      />
      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap gap-3 px-5 md:px-8">
        <GoldButton to="/">Home</GoldButton>
        <GoldButton to="/shop" variant="outline">
          Shop all
        </GoldButton>
      </div>
    </main>
  )
}
