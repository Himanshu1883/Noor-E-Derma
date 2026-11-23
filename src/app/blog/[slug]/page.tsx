import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/page/PageHeader"
import { GoldButton } from "@/components/GoldButton"
import { getPost, posts } from "@/data/blog"

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: "Journal" }
  return { title: post.title, description: post.excerpt }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  return (
    <main className="dewy pt-28 pb-24">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Journal", href: "/blog" }, { label: post.title }]}
        eyebrow={`${post.category} · ${post.date}`}
        title={post.title}
        lede={post.excerpt}
      />
      <article className="mx-auto mt-12 max-w-3xl px-5 md:px-8">
        <div className="glass space-y-8 rounded-[32px] p-7 md:p-12">
          {post.body.map((block) => (
            <section key={block.copy}>
              {block.heading ? <h2 className="text-2xl font-medium">{block.heading}</h2> : null}
              <p className={`leading-relaxed text-ink/75 ${block.heading ? "mt-3" : ""}`}>{block.copy}</p>
            </section>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <GoldButton to="/how-to-use" variant="outline">
            How to use
          </GoldButton>
          <GoldButton to="/shop">Shop the ritual</GoldButton>
        </div>
        <p className="mt-8 text-sm text-ink/50">
          <Link href="/blog" className="hover:text-ink">
            ← All stories
          </Link>
        </p>
      </article>
    </main>
  )
}
