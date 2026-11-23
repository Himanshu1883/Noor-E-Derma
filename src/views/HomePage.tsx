"use client"

import { BrandIntro } from "@/sections/BrandIntro"
import { CtaBanner } from "@/sections/CtaBanner"
import { FAQ } from "@/sections/FAQ"
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
    <main>
      <Hero />
      <BrandIntro />
      <ProductShowcase />
      <FeaturedProducts />
      <Ritual />
      <Ingredients />
      <Results />
      <WhoItsFor />
      <Reviews />
      <FAQ />
      <CtaBanner />
    </main>
  )
}
