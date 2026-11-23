import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/PageHeader"
import { GoldButton } from "@/components/GoldButton"
import { ASSETS } from "@/data/config"

export const metadata: Metadata = {
  title: "About us",
  description: "Noor means light. We bring it back to your skin — Tan Eraser and Daily Detox Face Wash.",
}

const pillars = [
  { title: "Dermat-inspired", copy: "Actives you can name, printed on the pack: glutathione, kojic acid, niacinamide, BHA, vitamin E, aloe vera." },
  { title: "Face & body", copy: "Tan Eraser is a face-and-body ritual. One tube, wherever the sun lingered." },
  { title: "Men & women", copy: "Glow has no gender. The pack says so, and the shop is built that way." },
]

export default function Page() {
  return (
    <main className="dewy pt-28 pb-24">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="Our story"
        title="Noor means"
        accent="light"
        lede="We bring it back to your skin. Noor E Derma is a small, considered line: a 20-minute tan eraser and a daily detox face wash — made to look as calm as they feel."
      />
      <div className="mx-auto mt-14 max-w-7xl px-5 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-[32px]">
            <img src={ASSETS.hero1} alt="The Glow Duo" className="h-full min-h-[320px] w-full object-cover object-[78%_center]" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-lg leading-relaxed text-ink/75">
              This is not a catalogue of fifty SKUs. It is a ritual: cleanse deeply, erase the look of tan in twenty minutes, step into the day. The Tan Eraser Ritual Kit holds the full at-home set — lotion, travel, jar, brush and bowl.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink/75">
              Claims stay on the pack. Prices and reviews you see now are placeholders for this design draft.
            </p>
            <GoldButton to="/shop" className="mt-8 self-start">
              Shop the ritual
            </GoldButton>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {pillars.map((p) => (
            <article key={p.title} className="glass rounded-[28px] p-6">
              <h2 className="text-2xl font-medium">{p.title}</h2>
              <p className="mt-2 text-ink/65">{p.copy}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 text-sm text-ink/50">
          Read the{" "}
          <Link href="/ingredients" className="text-gold-deep underline-offset-4 hover:underline">
            ingredients
          </Link>{" "}
          or the{" "}
          <Link href="/how-to-use" className="text-gold-deep underline-offset-4 hover:underline">
            how-to-use
          </Link>{" "}
          ritual.
        </p>
      </div>
    </main>
  )
}
