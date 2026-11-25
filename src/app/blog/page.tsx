import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader } from "@/components/page/PageHeader"
import { posts } from "@/data/blog"

export const metadata: Metadata = {
  title: "Journal",
  description: "Skin school and rituals from Noor E Derma — tanning, daily detox, and how to use Tan Eraser.",
}

export default function Page() {
  return (
    <main className="dewy pt-28 pb-24">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Journal" }]}
        eyebrow="Journal"
        title="Skin"
        accent="school"
        lede="Short reads on tan, dullness, and the two-step ritual. Educational copy — not medical advice."
      />
      <div className="mx-auto mt-14 grid max-w-7xl gap-5 px-5 md:grid-cols-2 md:px-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="glass group rounded-[32px] p-7 transition hover:-translate-y-0.5">
            <p className="text-[11px] tracking-[0.24em] text-sage-600 uppercase">
              {post.category} · {post.date} · {post.read}
            </p>
            <h2 className="mt-4 text-3xl leading-tight font-medium group-hover:text-gold-deep">{post.title}</h2>
            <p className="mt-3 text-ink/65">{post.excerpt}</p>
            <span className="mt-6 inline-block text-sm text-gold-deep">Read →</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
