"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { ProductCard } from "@/components/ProductCard"
import { PageHeader } from "@/components/page/PageHeader"
import { ShopFilterBar, ShopFilters } from "@/components/shop/ShopFilters"
import { productsFor, type Collection } from "@/data/collections"
import { getLenis } from "@/hooks/useLenis"
import { sortProducts, type ShopSort } from "@/lib/shop"

export function ShopPage({ collection }: { collection?: Collection }) {
  const catalog = productsFor(collection)
  const [sort, setSort] = useState<ShopSort>("featured")
  const [mobileOpen, setMobileOpen] = useState(false)
  const products = useMemo(() => sortProducts(catalog, sort), [catalog, sort])

  useEffect(() => {
    const lenis = getLenis()
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
      lenis?.stop()
    } else {
      document.body.style.overflow = ""
      lenis?.start()
    }
    return () => {
      document.body.style.overflow = ""
      lenis?.start()
    }
  }, [mobileOpen])

  return (
    <main className="dewy pt-28 pb-24">
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: collection ? "/shop" : undefined },
          ...(collection ? [{ label: collection.title }] : []),
        ]}
        eyebrow={collection?.eyebrow ?? "Shop all"}
        title={collection ? collection.title : "All"}
        accent={collection ? collection.accent : "products"}
        lede={
          collection?.intro ??
          "Tan Eraser, Daily Detox Face Wash, the Tan Eraser Ritual Kit, and the Glow Duo."
        }
      />

      <div className="mx-auto mt-10 max-w-7xl px-5 md:px-8">
        <ShopFilterBar sort={sort} onSort={setSort} onOpen={() => setMobileOpen(true)} />

        <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:items-start lg:gap-8">
          <aside className="sticky top-28 hidden lg:block">
            <ShopFilters collection={collection} sort={sort} onSort={setSort} />
          </aside>

          {products.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-ink/50">Nothing in this collection yet.</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close filters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-sage-800/30 backdrop-blur-[2px] lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-3 left-3 z-[81] w-[min(100%-1.5rem,280px)] lg:hidden"
            >
              <ShopFilters
                collection={collection}
                sort={sort}
                onSort={setSort}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </main>
  )
}
