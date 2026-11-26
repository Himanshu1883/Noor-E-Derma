import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/PageHeader"
import { GoldButton } from "@/components/GoldButton"
import { dailyDetox, glowDuo, tanEraser, tanEraserKit } from "@/data/products"

export const metadata: Metadata = {
  title: "How to use",
  description: "How to use Noor E Derma Tan Eraser and Daily Detox Face Wash — the 20-minute glow ritual.",
}

const rituals = [dailyDetox, tanEraser, tanEraserKit, glowDuo]

export default function Page() {
  return (
    <main className="dewy min-w-0 max-w-full overflow-x-clip pt-28 pb-24">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "How to use" }]}
        eyebrow="Rituals"
        title="How to"
        accent="use"
        lede="The same sequence you will find on pack, written out so the ritual is easy to repeat. Always patch test first."
      />

      <div className="mx-auto mt-14 max-w-7xl space-y-6 px-5 md:px-8">
        {rituals.map((product) => (
          <article key={product.id} className="glass overflow-hidden rounded-[32px] md:grid md:grid-cols-12">
            <div className="relative min-h-[220px] md:col-span-5">
              <img
                src={product.images[0].src}
                alt={product.images[0].alt}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: product.images[0].position ?? "center" }}
              />
            </div>
            <div className="p-7 md:col-span-7 md:p-10">
              <p className="eyebrow">{product.netWeight ?? "Bundle"}</p>
              <h2 className="mt-3 text-3xl font-medium md:text-4xl">{product.name}</h2>
              <p className="mt-2 text-ink/65">{product.cardLine ?? product.tagline}</p>
              <ol className="mt-6 space-y-3">
                {product.howToUse.map((step) => (
                  <li key={step.step} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-50 font-display text-gold-deep ring-1 ring-gold/30">
                      {step.step}
                    </span>
                    <span>
                      <span className="block font-medium">{step.title}</span>
                      <span className="block text-sm text-ink/65">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              {product.hasDetailPage ? (
                <GoldButton to={`/product/${product.slug}`} variant="outline" className="mt-8">
                  View {product.name}
                </GoldButton>
              ) : null}
            </div>
          </article>
        ))}

        <aside className="rounded-[32px] bg-sage-50 p-8 md:p-10">
          <h2 className="text-2xl font-medium">Patch test</h2>
          <p className="mt-3 max-w-2xl text-ink/70">
            Apply a small amount to the inner arm, wait, and continue only if the skin stays comfortable. Discontinue if irritation appears. This page does not replace on-pack directions.
          </p>
          <p className="mt-6 text-sm text-ink/55">
            Ritual films will sit here later, the way a how-to-use page usually holds product videos.{" "}
            <Link href="/faq" className="text-gold-deep underline-offset-4 hover:underline">
              Read the FAQ
            </Link>
            .
          </p>
        </aside>
      </div>
    </main>
  )
}
