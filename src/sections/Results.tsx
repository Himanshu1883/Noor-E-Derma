"use client"

import { Sparkles, Sun, Timer } from "lucide-react"
import { useEffect, useRef } from "react"
import { ASSETS } from "@/data/config"
import { gsap, registerGsap } from "@/lib/gsap"

const stats = [
  { icon: Timer, value: 20, suffix: " min", label: "Erases tan — as printed on pack" },
  { icon: Sun, value: null, suffix: "", label: "Face and body" },
  { icon: Sparkles, value: null, suffix: "", label: "For men and women" },
]

export function Results() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    registerGsap()
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
        const obj = { n: 0 }
        gsap.to(obj, {
          n: Number(node.dataset.count),
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: node, start: "top 85%" },
          onUpdate: () => (node.textContent = Math.floor(obj.n).toLocaleString("en-IN")),
        })
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="results" ref={ref} className="dewy-sage py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-12 md:items-center md:px-8">
        <div className="md:col-span-7">
          <img
            src={ASSETS.tanBeforeAfter}
            alt="Tan Eraser before and after — visible results for brighter, even-toned skin"
            className="w-full rounded-[32px] shadow-[0_28px_60px_-28px_rgb(var(--tint)/0.45)]"
          />
        </div>
        <div className="md:col-span-5">
          <p className="eyebrow">Results</p>
          <h2 className="mt-3 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-none font-medium">
            Light, <span className="gold-text italic">returned.</span>
          </h2>
          <p className="mt-4 text-ink/60">A 20-minute tan-care ritual for sun-tanned and dull-looking skin — face and body, men and women.</p>
          <div className="mt-8 space-y-3">
            {stats.map(({ icon: Icon, value, suffix, label }) => (
              <div key={label} className="glass flex items-center gap-4 rounded-3xl p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gold-fill text-white">
                  <Icon size={20} />
                </span>
                <div>
                  {value != null ? (
                    <p className="font-display text-3xl font-medium">
                      <span data-count={value}>0</span>
                      {suffix}
                    </p>
                  ) : (
                    <p className="font-display text-2xl font-medium">{label}</p>
                  )}
                  {value != null ? <p className="text-sm text-ink/60">{label}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
