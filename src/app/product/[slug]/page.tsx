import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { dailyDetox, getDetailProduct, glowDuo, tanEraser, tanEraserKit } from "@/data/products"
import { ProductPage } from "@/views/ProductPage"

export function generateStaticParams() {
  return [tanEraser, dailyDetox, tanEraserKit, glowDuo].map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getDetailProduct(slug)
  if (!product) return { title: "NOOR E DERMA — Skin That Glows" }
  return {
    title: `${product.name} — NOOR E DERMA`,
    description: product.description,
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getDetailProduct(slug)) redirect("/")
  return <ProductPage slug={slug} />
}
