"use client"

import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Bubbles } from "@/components/Bubbles"
import { GoldButton } from "@/components/GoldButton"
import { GoldSwirl } from "@/components/GoldSwirl"
import { useCart } from "@/context/CartContext"
import { useUI } from "@/context/UIContext"
import { ASSETS, BUNDLE, LAUNCH_OFFER_ENDS } from "@/data/config"
import { glowDuo } from "@/data/products"
import { formatINR } from "@/lib/format"

function useCountdown(iso: string) {
  const [parts, setParts] = useState([0, 0, 0, 0])
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(iso).getTime() - Date.now())
      setParts([
        Math.floor(diff / 86400000),
        Math.floor((diff % 86400000) / 3600000),
        Math.floor((diff % 3600000) / 60000),
        Math.floor((diff % 60000) / 1000),
      ])
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [iso])
  return parts
}

const labels = ["Days", "Hrs", "Min", "Sec"]

export function CtaBanner() {
  const time = useCountdown(LAUNCH_OFFER_ENDS)
  const { add } = useCart()
  const { setCartOpen } = useUI()

  return (
    <section className="bg-ivory px-3 pb-3 md:px-6 md:pb-6">
      <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[40px] theme-a:rounded-[8px] bg-[linear-gradient(135deg,var(--cta-from),var(--cta-via)_60%,var(--cta-to))] text-white md:grid-cols-2">
        <Bubbles count={8} className="opacity-50" />
        <GoldSwirl className="bottom-0 left-0 h-[60%] w-full opacity-60" />
        <div className="relative p-8 md:p-14">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-gold-bright ring-1 ring-white/20">
            Limited launch offer
          </span>
          <h2 className="mt-5 text-[clamp(2.6rem,5.5vw,4.8rem)] leading-[0.95] font-medium">
            Ready to <span className="italic text-gold-bright">Glow?</span>
          </h2>
          <p className="mt-4 max-w-md text-white/75">
            {BUNDLE.name}: Tan Eraser + Daily Detox Face Wash, together for less.
          </p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-semibold">{formatINR(BUNDLE.price)}</span>
            <span className="text-white/50 line-through">{formatINR(BUNDLE.compareAt)}</span>
          </div>
          <div className="mt-6 flex gap-2">
            {time.map((t, i) => (
              <div key={labels[i]} className="w-16 rounded-2xl bg-white/12 py-2 text-center ring-1 ring-white/15 backdrop-blur">
                <span className="block font-display text-2xl tabular-nums">{String(t).padStart(2, "0")}</span>
                <span className="block text-[10px] tracking-wider text-white/60 uppercase">{labels[i]}</span>
              </div>
            ))}
          </div>
          <GoldButton
            className="mt-8 px-8 py-4 text-[15px]"
            onClick={() => {
              void add(glowDuo)
              setCartOpen(true)
            }}
          >
            Get the Glow Duo <ArrowRight size={16} />
          </GoldButton>
          <p className="mt-3 text-[11px] text-white/45">Placeholder price and countdown for this design draft.</p>
        </div>
        <div className="relative min-h-[300px]">
          <img
            src={ASSETS.hero1}
            alt="The Glow Duo"
            className="absolute inset-0 h-full w-full object-cover object-[78%_center] [mask-image:linear-gradient(180deg,transparent,#000_30%)] md:[mask-image:linear-gradient(90deg,transparent,#000_35%)]"
          />
        </div>
      </div>
    </section>
  )
}
