"use client"

import { motion } from "framer-motion"
import { Box, ChevronRight, Droplets, Play, RefreshCw, Sparkles, Sun } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Accordion } from "@/components/Accordion"
import { Bubbles } from "@/components/Bubbles"
import { GoldButton } from "@/components/GoldButton"
import { Molecule, type MoleculeKind } from "@/components/Molecule"
import { ProductCard } from "@/components/ProductCard"
import { QuantityStepper } from "@/components/QuantityStepper"
import { PhotoReviewCard } from "@/components/PhotoReviewCard"
import { StarRating } from "@/components/StarRating"
import { StickyAtcBar } from "@/components/StickyAtcBar"
import { WishButton } from "@/components/WishButton"
import { TrustBadges } from "@/components/TrustBadges"
import { useCart } from "@/context/CartContext"
import { useUI } from "@/context/UIContext"
import { getCatalog, getDetailProduct, type Benefit, type Product } from "@/data/products"
import { reviews } from "@/data/reviews"
import { getLenis } from "@/hooks/useLenis"
import { useShouldRender3D } from "@/hooks/useMedia"
import { api } from "@/lib/client"
import { cn } from "@/lib/cn"
import { formatINR, savePercent } from "@/lib/format"
import { gsap, registerGsap } from "@/lib/gsap"

const ProductBoxScene = dynamic(() => import("@/three/ProductBoxScene"), { ssr: false })

const benefitIcon: Record<Benefit["icon"], typeof Sun> = {
  sun: Sun,
  sparkles: Sparkles,
  droplet: Droplets,
  leaf: Sparkles,
  refresh: RefreshCw,
  face: Sparkles,
}

const moleculeFor: Record<string, MoleculeKind> = {
  Glutathione: "glutathione",
  "Kojic Acid": "kojic",
  Niacinamide: "niacinamide",
  "Vitamin E": "vitamin-e",
  BHA: "bha",
  "Aloe Vera": "aloe",
}

function SectionTitle({ eyebrow, title, accent }: { eyebrow: string; title: string; accent: string }) {
  return (
    <div className="text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] leading-none font-medium">
        {title} <span className="gold-text italic">{accent}</span>
      </h2>
    </div>
  )
}

export function ProductPage({ slug }: { slug: string }) {
  const fallback = getDetailProduct(slug)
  const [live, setLive] = useState<Product | null>(null)
  const product = live ?? fallback
  const { add } = useCart()
  const { setCartOpen } = useUI()
  const enable3d = useShouldRender3D()
  const [qty, setQty] = useState(1)
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState({ x: 50, y: 50, on: false })
  const [viewer, setViewer] = useState(false)
  const [sticky, setSticky] = useState(false)
  const buyRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLOListElement>(null)
  const spin = useRef(0.5)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let cancelled = false
    void api<{ product: Product }>(`/api/products/${encodeURIComponent(slug)}`)
      .then((data) => {
        if (!cancelled && data.product) setLive({ ...fallback, ...data.product } as Product)
      })
      .catch(() => {
        if (!cancelled) setLive(null)
      })
    return () => {
      cancelled = true
    }
  }, [slug, fallback])

  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    setActive(0)
    setViewer(false)
    setQty(1)
  }, [slug])

  useEffect(() => {
    const src = product?.images.find((img) => img.type === "video")?.src
    if (!src) return
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "video"
    link.href = src
    link.type = "video/mp4"
    document.head.appendChild(link)
    return () => link.remove()
  }, [product])

  useEffect(() => {
    const el = buyRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(el)
    return () => io.disconnect()
  }, [slug])

  useEffect(() => {
    registerGsap()
    const el = timelineRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(".timeline-fill", { scaleY: 0 }, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [slug])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const current = product?.images[active]
    if (current?.type === "video" && !viewer) {
      const play = () => {
        void video.play().catch(() => {})
      }
      if (video.readyState >= 2) play()
      else video.addEventListener("canplay", play, { once: true })
      return () => video.removeEventListener("canplay", play)
    }
    video.pause()
  }, [active, viewer, slug, product])

  const related = useMemo(() => getCatalog().filter((p) => p.id !== product?.id), [product])

  if (!product) return null

  const save = savePercent(product.price, product.compareAt)
  const gallery = product.images
  const image = gallery[active]
  const isVideo = image?.type === "video"
  const videoSlide = gallery.find((img) => img.type === "video")
  const productReviews = reviews.filter((r) => r.productId === product.id)
  const addToCart = () => {
    void add(product, qty)
    setCartOpen(true)
  }

  return (
    <main className="dewy min-w-0 max-w-full overflow-x-clip pt-28">
      <div className="mx-auto min-w-0 max-w-7xl px-5 md:px-8">
        <nav className="flex min-w-0 flex-wrap items-center gap-1.5 text-[13px] text-ink/50" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <ChevronRight size={14} />
          <Link href="/#shop" className="hover:text-ink">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid min-w-0 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="min-w-0 lg:sticky lg:top-28 lg:col-span-7 lg:self-start">
            <div
              className="glass relative aspect-square overflow-hidden rounded-[36px] bg-peach lg:aspect-auto lg:h-[min(36rem,calc(100svh-15rem))]"
              onMouseEnter={() => !viewer && !isVideo && !image.contain && setZoom((z) => ({ ...z, on: true }))}
              onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                const x = (e.clientX - r.left) / r.width
                if (viewer) {
                  spin.current = x
                  return
                }
                if (isVideo || image.contain) return
                setZoom({ on: true, x: x * 100, y: ((e.clientY - r.top) / r.height) * 100 })
              }}
            >
              {videoSlide ? (
                <video
                  ref={videoRef}
                  src={videoSlide.src}
                  poster={videoSlide.poster}
                  controls
                  playsInline
                  preload="auto"
                  className={cn(
                    "h-full w-full object-cover",
                    isVideo && !viewer ? "relative z-10" : "pointer-events-none absolute inset-0 z-0 opacity-0",
                  )}
                  aria-label={videoSlide.alt}
                />
              ) : null}
              {viewer && enable3d ? (
                <Suspense fallback={null}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,#fff,var(--t-50)_70%)]">
                    <ProductBoxScene progress={spin} urls={[gallery[0].src]} />
                  </div>
                  <span className="glass absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs">Move your cursor to rotate</span>
                </Suspense>
              ) : isVideo ? null : (
                <motion.img
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={image.src}
                  alt={image.alt}
                  className={cn(
                    "h-full w-full transition-transform duration-300 ease-out",
                    image.contain ? "object-contain bg-[#f6ead6]" : "object-cover",
                  )}
                  style={{
                    objectPosition: image.position ?? "center",
                    transform: `scale(${(image.scale ?? 1) * (zoom.on ? 1.5 : 1)})`,
                    transformOrigin: zoom.on ? `${zoom.x}% ${zoom.y}%` : image.position ?? "center",
                  }}
                />
              )}
              {save > 0 ? (
                <span className="absolute top-4 left-4 rounded-full bg-sage-800 px-3 py-1 text-xs font-medium text-white">Save {save}%</span>
              ) : null}
            </div>
            <div className="mt-3 flex min-w-0 max-w-full gap-3 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {gallery.map((img, i) => (
                <button
                  key={img.alt}
                  type="button"
                  onClick={() => {
                    setViewer(false)
                    setActive(i)
                  }}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 transition md:h-24 md:w-24",
                    active === i && !viewer ? "ring-gold" : "ring-transparent opacity-70 hover:opacity-100",
                  )}
                  aria-label={img.alt}
                >
                  {img.type === "video" ? (
                    <>
                      <img src={img.poster ?? img.src} alt="" className="h-full w-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center bg-ink/35">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full gold-fill text-white">
                          <Play size={14} fill="currentColor" />
                        </span>
                      </span>
                    </>
                  ) : (
                    <img
                      src={img.src}
                      alt=""
                      className={cn("h-full w-full", img.contain ? "object-contain bg-[#f6ead6]" : "object-cover")}
                      style={{ objectPosition: img.position ?? "center", transform: `scale(${img.scale ?? 1})`, transformOrigin: img.position ?? "center" }}
                    />
                  )}
                </button>
              ))}
              {enable3d ? (
                <button
                  type="button"
                  onClick={() => setViewer(true)}
                  className={cn(
                    "flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-medium transition md:h-24 md:w-24",
                    viewer ? "gold-fill text-white" : "bg-white text-sage-800 ring-1 ring-sage-100",
                  )}
                >
                  <Box size={20} /> 3D view
                </button>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
              <p className="eyebrow">{product.tagline}</p>
              <h1 className="mt-3 break-words text-[clamp(2.6rem,5vw,4.2rem)] leading-[0.95] font-medium">{product.name}</h1>
              <StarRating className="mt-4" rating={product.rating} count={product.reviewCount} />
              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl font-semibold">{formatINR(product.price)}</span>
                {product.compareAt ? <span className="text-lg text-ink/40 line-through">{formatINR(product.compareAt)}</span> : null}
                {save > 0 ? <span className="rounded-full bg-gold-bright/20 px-2.5 py-1 text-xs font-semibold text-gold-deep">You save {save}%</span> : null}
              </div>
              <p className="mt-1 text-xs text-ink/45">Inclusive of all taxes · {product.netWeight}</p>
              <p className="mt-5 leading-relaxed text-ink/70">{product.description}</p>
              {product.customFields?.length ? (
                <dl className="mt-5 overflow-hidden rounded-3xl bg-white/70 ring-1 ring-sage-100">
                  {product.customFields.map((field) => (
                    <div key={field.label} className="flex justify-between gap-4 border-t border-sage-50 px-4 py-3 text-sm first:border-t-0">
                      <dt className="text-ink/50">{field.label}</dt>
                      <dd className="font-medium">{field.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2">
                {product.badges.map((b) => (
                  <span key={b} className="rounded-full bg-sage-50 px-3 py-1.5 text-[13px] text-sage-800">{b}</span>
                ))}
              </div>

              <div ref={buyRef} className="mt-7 grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] gap-3">
                <QuantityStepper value={qty} onChange={setQty} />
                <GoldButton variant="black" className="min-w-0 w-full px-4 py-3.5 sm:px-6" onClick={addToCart}>Add to Cart</GoldButton>
                <WishButton product={product} size={48} />
                <GoldButton variant="outline" className="col-span-full w-full py-3.5" onClick={addToCart}>Buy Now</GoldButton>
              </div>

              <div className="mt-5">
                <TrustBadges />
              </div>
          </div>
        </div>
      </div>

      <section className="mx-auto min-w-0 max-w-7xl overflow-x-clip px-5 pt-24 md:px-8">
        <SectionTitle eyebrow="Benefits" title="What it" accent="does" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {product.benefits.map((b, i) => {
            const Icon = benefitIcon[b.icon]
            return (
              <motion.article
                key={b.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-[32px] p-7"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl gold-fill text-white">
                  <Icon size={24} />
                </span>
                <h3 className="mt-5 text-2xl font-medium">{b.label}</h3>
                <p className="mt-2 text-ink/65">{b.detail}</p>
              </motion.article>
            )
          })}
        </div>
      </section>

      <section className="relative mt-24 overflow-hidden dewy-sage py-20">
        <Bubbles count={8} />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <SectionTitle eyebrow="Key ingredients" title="Clean" accent="science" />
          <p className="mt-3 text-center text-sm text-ink/55">Named actives, as printed on the pack.</p>
          <div className={cn("mt-10 grid gap-4", product.actives.length > 2 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2")}>
            {product.actives.map((a) => (
              <div key={a.name} className="group glass rounded-[32px] p-6">
                <div className="flex h-28 items-center justify-center rounded-3xl bg-white/70">
                  <Molecule kind={moleculeFor[a.name] ?? "aloe"} className="w-36" />
                </div>
                <h3 className="mt-5 text-2xl font-medium">{a.name}</h3>
                <p className="mt-3 text-sm text-ink/60">{a.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto min-w-0 max-w-3xl overflow-x-clip px-5 pt-24 md:px-8">
        <SectionTitle eyebrow="How to use" title="Your" accent="ritual" />
        <ol ref={timelineRef} className="relative mt-12 space-y-5">
          <span className="absolute top-6 bottom-6 left-6 w-0.5 bg-sage-100" />
          <span className="timeline-fill absolute top-6 bottom-6 left-6 w-0.5 origin-top gold-fill" />
          {product.howToUse.map((step) => (
            <motion.li
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="relative flex gap-5"
            >
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white font-display text-lg text-gold-deep ring-2 ring-gold/40">
                {step.step}
              </span>
              <div className="glass min-w-0 flex-1 rounded-3xl p-5">
                <h3 className="text-xl font-medium">{step.title}</h3>
                <p className="mt-1 text-ink/65">{step.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="mx-auto min-w-0 max-w-7xl overflow-x-clip px-5 pt-24 md:px-8">
        <SectionTitle eyebrow="Reviews" title={product.id === "tan-eraser" ? "Real" : "Loved by"} accent={product.id === "tan-eraser" ? "results" : "you"} />
        {product.id === "tan-eraser" ? (
          <>
            <div className="mt-10 flex min-w-0 flex-wrap justify-center gap-5">
              {productReviews.map((r) => (
                <PhotoReviewCard key={r.id} review={r} />
              ))}
            </div>
            <p className="mx-auto mt-5 max-w-md text-center text-[12px] leading-relaxed text-ink/45">
              Client photos after one 20-minute Tan Eraser ritual. Individual results vary. Always patch-test and follow pack directions.
            </p>
          </>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {(productReviews.length ? productReviews : reviews.slice(0, 3)).map((r) => (
              <figure key={r.id} className="glass rounded-[28px] p-6">
                <StarRating rating={r.rating} />
                <p className="mt-3 font-display text-xl">“{r.title}”</p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{r.body}</p>
                <figcaption className="mt-4 flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-800 text-xs font-semibold text-white">{r.initials}</span>
                  <span className="min-w-0 truncate text-sm font-medium">{r.name}</span>
                  <span className="ml-auto shrink-0 rounded-full bg-sage-50 px-2.5 py-1 text-[11px] text-sage-600">Verified Buyer</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto min-w-0 max-w-3xl overflow-x-clip px-5 pt-24 md:px-8">
        <SectionTitle eyebrow="FAQ" title="Good to" accent="know" />
        <div className="mt-10">
          <Accordion items={product.faqs} />
        </div>
      </section>

      <section className="mx-auto min-w-0 max-w-7xl overflow-x-clip px-5 pt-24 pb-24 md:px-8">
        <SectionTitle eyebrow="Pairs well with" title="Complete the" accent="ritual" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <StickyAtcBar product={product} quantity={qty} visible={sticky} />
    </main>
  )
}
