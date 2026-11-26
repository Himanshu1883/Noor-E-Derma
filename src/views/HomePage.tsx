"use client"

import { BrandIntro } from "@/sections/BrandIntro"
import { CtaBanner } from "@/sections/CtaBanner"
import { FAQ } from "@/sections/FAQ"
import { KitBanner } from "@/sections/KitBanner"
import { FeaturedProducts } from "@/sections/FeaturedProducts"
import { Hero } from "@/sections/Hero"
import { Ingredients } from "@/sections/Ingredients"
import { ProductShowcase } from "@/sections/ProductShowcase"
import { Results } from "@/sections/Results"
import { Reviews } from "@/sections/Reviews"
import { Ritual } from "@/sections/Ritual"
import { WhoItsFor } from "@/sections/WhoItsFor"

export function HomePage() {
  return (
    <main className="min-w-0 max-w-full overflow-x-clip">
      <Hero />
      <BrandIntro />
      <ProductShowcase />
      <FeaturedProducts />
      <Ritual />
      <Ingredients />
      <Results />
      <WhoItsFor />
      <Reviews />
      <KitBanner />
      <FAQ />
      <CtaBanner />
    </main>
  )
}
