"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Droplets, FlaskConical, Leaf, Sparkles, Timer, Users } from "lucide-react"
import dynamic from "next/dynamic"
import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from "react"

class SceneGuard extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
import { GoldButton } from "@/components/GoldButton"
import { ASSETS } from "@/data/config"
import { dailyDetox, tanEraser } from "@/data/products"
import { useTheme } from "@/context/ThemeContext"
import { useShouldRender3D } from "@/hooks/useMedia"
import { gsap, registerGsap } from "@/lib/gsap"
import { formatINR } from "@/lib/format"
import { cn } from "@/lib/cn"

const ProductBoxScene = dynamic(() => import("@/three/ProductBoxScene"), { ssr: false })

const stages = [
  {
    product: tanEraser,
    image: ASSETS.cardTan,
    callouts: [
      { icon: FlaskConical, title: "Glutathione + Kojic Acid", sub: "Hero actives on pack" },
      { icon: Timer, title: "20-minute action", sub: "Erases tan in 20 minutes" },
      { icon: Sparkles, title: "Face & Body", sub: "One tube, head to toe" },
      { icon: Users, title: "Men & Women", sub: "Made for everyone" },
    ],
  },
  {
    product: dailyDetox,
    image: ASSETS.cardDetox,
    callouts: [
      { icon: Sparkles, title: "Niacinamide", sub: "Key active" },
      { icon: Droplets, title: "Vitamin E", sub: "Key active" },
      { icon: FlaskConical, title: "BHA", sub: "Key active" },
      { icon: Leaf, title: "Aloe Vera", sub: "Key active" },
    ],
  },
]

export function ProductShowcase() {
  const ref = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const { theme } = useTheme()
  const enable3d = useShouldRender3D({ allowNarrow: true })
  const [stage, setStage] = useState(0)
  const [local, setLocal] = useState(0)

  useEffect(() => {
    registerGsap()
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=160%",
          pin: true,
          scrub: true,
          onUpdate: (self) => {
            progress.current = self.progress
            const s = self.progress >= 0.5 ? 1 : 0
            setStage(s)
            setLocal(s === 0 ? self.progress / 0.5 : (self.progress - 0.5) / 0.5)
          },
        },
      })
    }, el)
    return () => ctx.revert()
  }, [theme])

  const current = stages[stage]

  return (
    <section ref={ref} className="relative h-svh min-h-[640px] overflow-hidden dewy-sage">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95),rgba(255,255,255,0)_68%)]" />

      <div className="relative mx-auto grid h-full max-w-7xl grid-rows-[auto_minmax(220px,1fr)_auto] items-center gap-3 px-5 pt-20 pb-8 md:grid-cols-12 md:grid-rows-1 md:gap-6 md:px-8 md:pt-20 md:pb-10">
        <div className="md:col-span-4">
          <p className="eyebrow">In focus · 0{stage + 1} / 02</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="mt-2 text-[clamp(2.1rem,9vw,4.2rem)] leading-[0.95] font-medium md:mt-3 md:text-[clamp(2.4rem,4.6vw,4.2rem)]">
                {current.product.name.split(" ").slice(0, 2).join(" ")}
              </h2>
              <p className="mt-2 max-w-sm text-base text-ink/65 md:mt-3 md:text-lg">{current.product.tagline}</p>
              <div className="mt-4 flex items-center gap-3 md:mt-6">
                <span className="text-2xl font-semibold">{formatINR(current.product.price)}</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs text-ink/60 ring-1 ring-sage-100">{current.product.netWeight}</span>
              </div>
              <GoldButton to={`/product/${current.product.slug}`} className="mt-4 md:mt-6">
                Explore {stage === 0 ? "Tan Eraser" : "Face Wash"} <ArrowRight size={16} />
              </GoldButton>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative h-full min-h-[220px] touch-pan-y md:col-span-5">
          {enable3d ? (
            <SceneGuard
              fallback={
                <img src={current.image} alt={current.product.name} className="absolute inset-0 m-auto max-h-full w-auto rounded-[32px] object-contain" />
              }
            >
              <div className="absolute inset-0">
                <Suspense fallback={null}>
                  <ProductBoxScene progress={progress} />
                </Suspense>
              </div>
            </SceneGuard>
          ) : (
            <AnimatePresence mode="wait">
              <motion.img
                key={current.image}
                src={current.image}
                alt={current.product.name}
                initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.92, rotate: 4 }}
                className="absolute inset-0 m-auto max-h-full w-auto rounded-[32px] object-contain"
              />
            </AnimatePresence>
          )}
        </div>

        <ul className="grid grid-cols-2 gap-2 md:col-span-3 md:grid-cols-1 md:gap-3">
          {current.callouts.map((c, i) => {
            const shown = local > i * 0.18 || !enable3d
            const Icon = c.icon
            return (
              <li
                key={`${stage}-${c.title}`}
                className={cn(
                  "relative flex items-center gap-3 transition-all duration-500",
                  shown ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
                )}
              >
                <span className="absolute top-1/2 -left-14 hidden h-px w-12 bg-[linear-gradient(90deg,transparent,#b8860b)] md:block" />
                <span className="absolute top-1/2 -left-2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gold md:block" />
                <div className="glass flex w-full items-center gap-2.5 rounded-2xl p-2 pr-3 md:gap-3 md:p-2.5 md:pr-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sage-50 text-sage-600 md:h-10 md:w-10">
                    <Icon size={18} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[14px] font-semibold">{c.title}</span>
                    <span className="block text-xs text-ink/55">{c.sub}</span>
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-sage-100">
        <div className="h-full gold-fill transition-[width] duration-150" style={{ width: `${((stage + local) / 2) * 100}%` }} />
      </div>
    </section>
  )
}
