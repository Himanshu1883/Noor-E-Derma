import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { collections, getCollection } from "@/data/collections"
import { ShopPage } from "@/views/ShopPage"

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection: slug } = await params
  const collection = getCollection(slug)
  if (!collection) return { title: "Shop" }
  return {
    title: `${collection.title} ${collection.accent}`,
    description: collection.intro,
  }
}

export default async function Page({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: slug } = await params
  const collection = getCollection(slug)
  if (!collection) notFound()
  return <ShopPage collection={collection} />
}
