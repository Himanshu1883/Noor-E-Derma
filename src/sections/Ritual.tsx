"use client"

import { useEffect, useRef, useState } from "react"
import { Bubbles } from "@/components/Bubbles"
import { ASSETS } from "@/data/config"
import { gsap, registerGsap } from "@/lib/gsap"
import { cn } from "@/lib/cn"

const panels = [
  {
    num: "01",
    title: "Cleanse",
    product: "Daily Detox Face Wash",
    copy: "Work a small amount into a light lather. Niacinamide, Vitamin E, BHA and Aloe Vera cleanse deeply and refresh.",
    image: ASSETS.cardDetox,
    pos: "center",
  },
  {
    num: "02",
    title: "Prep",
    product: "A quiet minute",
    copy: "Pat skin dry with a soft towel. Clean, calm skin is the canvas for everything that follows.",
    image: ASSETS.hero1,
    pos: "0% center",
  },
  {
    num: "03",
    title: "Erase",
    product: "Tan Eraser",
    copy: "Smooth an even layer over sun-tanned areas. With Glutathione + Kojic Acid. Erases tan in 20 minutes.",
    image: ASSETS.cardTan,
    pos: "center",
  },
  {
    num: "04",
    title: "Glow",
    product: "Rinse & reveal",
    copy: "Rinse with lukewarm water, moisturise, and step out with skin that glows and confidence that shows.",
    image: ASSETS.hero1,
    pos: "62% center",
  },
]

export function Ritual() {
  const pin = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    registerGsap()
    const section = pin.current
    const row = track.current
    if (!section || !row) return
    const ctx = gsap.context(() => {
      const distance = () => row.scrollWidth - window.innerWidth
      gsap.to(row, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1)))),
        },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section id="ritual" ref={pin} className="relative h-svh min-h-[620px] overflow-hidden dewy-sage">
      <Bubbles count={6} className="opacity-60" />
      <div className="absolute inset-x-0 top-24 z-10 mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-5 md:top-28 md:px-8">
        <div>
          <p className="eyebrow">The ritual</p>
          <h2 className="mt-2 text-[clamp(2rem,4vw,3.4rem)] leading-none font-medium">
            Four steps to <span className="gold-text italic">glow</span>
          </h2>
        </div>
        <div className="flex gap-1.5">
          {panels.map((p, i) => (
            <span
              key={p.num}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                i === active ? "bg-sage-800 text-white" : "bg-white/70 text-ink/50",
              )}
            >
              {p.title}
            </span>
          ))}
        </div>
      </div>

      <div ref={track} className="flex h-full w-max items-center gap-6 pt-36 pr-[8vw] pl-5 md:gap-8 md:pt-40 md:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
        {panels.map((panel) => (
          <article
            key={panel.num}
            className="glass grid h-[min(62vh,520px)] w-[86vw] shrink-0 grid-rows-[1fr_auto] overflow-hidden rounded-[36px] md:w-[min(72vw,920px)] md:grid-cols-2 md:grid-rows-1"
          >
            <div className="relative overflow-hidden">
              <img src={panel.image} alt="" className="h-full w-full object-cover" style={{ objectPosition: panel.pos }} />
              <span className="glass absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-medium">{panel.product}</span>
            </div>
            <div className="relative flex flex-col justify-center p-6 md:p-10">
              <span className="font-mega pointer-events-none absolute top-2 right-6 text-[7rem] leading-none text-sage-100 md:text-[9rem]">
                {panel.num}
              </span>
              <p className="relative text-sm font-medium text-gold-deep">Step {panel.num}</p>
              <h3 className="relative mt-1 text-4xl font-medium md:text-6xl">{panel.title}</h3>
              <p className="relative mt-4 max-w-sm text-[15px] leading-relaxed text-ink/70 md:text-base">{panel.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
