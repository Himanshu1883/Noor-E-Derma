import { ProductCard } from "@/components/ProductCard"
import { getFeaturedProducts } from "@/data/products"

export function FeaturedProducts() {
  const products = getFeaturedProducts()

  return (
    <section id="shop" className="relative dewy py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Shop the collection</p>
            <h2 className="mt-3 text-[clamp(2.2rem,4.5vw,3.8rem)] leading-none font-medium">
              Your <span className="gold-text italic">glow</span> essentials
            </h2>
          </div>
          <p className="max-w-sm text-ink/60">
            Two Noor E Derma hero products
            {products[2]?.partnerBrand ? ", plus a spa kit from our partner brand." : ", plus the Glow Duo bundle."}
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
