"use client"

import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { ASSETS } from "@/data/config"
import { gsap, registerGsap } from "@/lib/gsap"

const cards = [
  {
    title: "Face & Body",
    copy: "Tan Eraser is made for face and body: the same 20-minute ritual wherever the sun lingered.",
    image: ASSETS.hero1,
    pos: "70% center",
    to: "/product/tan-eraser",
  },
  {
    title: "Men & Women",
    copy: "It says so right on the pack. One shared ritual, no gatekeeping, just glow.",
    image: ASSETS.cardDetox,
    pos: "center 30%",
    to: "/product/daily-detox-face-wash",
  },
]

export function WhoItsFor() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    registerGsap()
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-parallax]").forEach((img) => {
        gsap.fromTo(img, { yPercent: -8 }, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ivory py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="eyebrow">Who it&apos;s for</p>
        <h2 className="mt-3 text-[clamp(2.2rem,4.5vw,3.6rem)] leading-none font-medium">
          Made for <span className="gold-text italic">everyone</span>
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cards.map((c) => (
            <Link key={c.title} href={c.to} className="group relative block h-[440px] overflow-hidden rounded-[36px]">
              <img
                data-parallax
                src={c.image}
                alt=""
                className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: c.pos }}
              />
              <div className="glass absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 rounded-[28px] p-5">
                <div>
                  <h3 className="text-3xl font-medium">{c.title}</h3>
                  <p className="mt-1.5 max-w-sm text-[15px] text-ink/70">{c.copy}</p>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full gold-fill text-white transition group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
