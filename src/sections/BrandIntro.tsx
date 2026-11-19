import { Leaf, Sparkles, Users } from "lucide-react"
import { useEffect, useRef } from "react"
import { Droplet } from "@/components/Bubbles"
import { GoldSwirl } from "@/components/GoldSwirl"
import { Marquee } from "@/components/Marquee"
import { gsap, registerGsap } from "@/lib/gsap"

const marquee = ["Dermatologically inspired", "Glow", "Confidence", "Glutathione", "Kojic Acid", "Niacinamide", "Aloe Vera", "Face & Body", "Men & Women"]

const statement = "Noor means light. We bring it back to your skin."

const pillars = [
  { icon: Sparkles, title: "Dermat-inspired", sub: "Actives you can name" },
  { icon: Leaf, title: "Face & Body", sub: "One ritual, everywhere" },
  { icon: Users, title: "Men & Women", sub: "Glow has no gender" },
]

export function BrandIntro() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    registerGsap()
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".intro-word",
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".intro-statement", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <Marquee items={marquee} />
      <section id="intro" ref={ref} className="relative overflow-hidden bg-ivory py-20 md:py-28 theme-a:md:py-40">
        <Droplet className="float absolute top-16 left-[8%] w-10 opacity-80" />
        <Droplet className="float absolute right-[10%] bottom-20 w-14" style={{ animationDelay: "1.5s" }} />
        <GoldSwirl className="top-[10%] left-[-10%] h-[70%] w-[120%] opacity-40" />
        <div className="relative mx-auto max-w-5xl px-6 text-center theme-a:max-w-6xl">
          <p className="eyebrow">Our story</p>
          <h2 className="intro-statement mt-5 text-[clamp(2.1rem,5vw,4.4rem)] leading-[1.08] font-normal theme-a:text-[clamp(2.6rem,6.4vw,6rem)] theme-a:leading-[1.02]">
            {statement.split(" ").map((w, i) => (
              <span
                key={i}
                className={`intro-word inline-block pr-[0.25em] ${w.startsWith("light") ? "gold-text italic" : ""}`}
              >
                {w}
              </span>
            ))}
          </h2>
          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
            {pillars.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 rounded-3xl bg-sage-50 p-3 text-left transition hover:-translate-y-1 hover:bg-sage-100">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sage-600">
                  <Icon size={18} />
                </span>
                <span className="leading-tight">
                  <span className="block text-[15px] font-semibold">{title}</span>
                  <span className="block text-xs text-ink/55">{sub}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
