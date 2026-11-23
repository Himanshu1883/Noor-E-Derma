import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Accordion } from "@/components/Accordion"
import { PageHeader } from "@/components/page/PageHeader"
import { getPolicy, policies } from "@/data/policies"

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const doc = getPolicy(slug)
  if (!doc) return { title: "Policy" }
  return { title: `${doc.title} ${doc.accent}`.trim(), description: doc.intro }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = getPolicy(slug)
  if (!doc) notFound()

  return (
    <main className="dewy pt-28 pb-24">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Policies" }, { label: doc.accent }]}
        eyebrow={doc.updated}
        title={doc.title}
        accent={doc.accent}
        lede={doc.intro}
      />
      <div className="mx-auto mt-12 max-w-3xl px-5 md:px-8">
        <Accordion
          items={doc.sections.map((s) => ({
            q: s.heading,
            a: s.copy.join(" "),
          }))}
        />
      </div>
    </main>
  )
}
