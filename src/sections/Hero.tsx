import { motion } from "framer-motion"
import { ArrowRight, Droplets, FlaskConical, Leaf, Sparkles, Timer } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Bubbles, Droplet } from "@/components/Bubbles"
import { GoldButton } from "@/components/GoldButton"
import { PartnerBadge } from "@/components/PartnerBadge"
import { useUI } from "@/context/UIContext"
import { getHeroSlides, type HeroChip, type HeroSlide } from "@/data/hero"
import { getLenis } from "@/hooks/useLenis"
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap"
import { cn } from "@/lib/cn"

const chipIcons: Record<HeroChip["icon"], typeof Timer> = {
  timer: Timer,
  flask: FlaskConical,
  leaf: Leaf,
  drop: Droplets,
  sparkle: Sparkles,
}

function Headline({ slide, play }: { slide: HeroSlide; play: boolean }) {
  let n = 0
  return (
    <h1 className="text-[clamp(3rem,6.2vw,6.1rem)] leading-[0.95] font-medium text-ink">
      {slide.headline.map((line, li) => (
        <span key={li} className="block">
          {line.map((word, wi) => {
            const i = n++
            return (
              <span key={wi} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom last:mr-0">
                <motion.span
                  className={cn("inline-block", word.accent && "gold-text pr-[0.06em] italic")}
                  initial={{ y: "110%" }}
                  animate={play ? { y: "0%" } : { y: "110%" }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word.text}
                </motion.span>
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

function SlideText({ slide, play }: { slide: HeroSlide; play: boolean }) {
  const right = slide.layout === "text-right"
  const fade = (d: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <div className={cn("hero-text relative z-10 flex flex-col", right ? "md:items-start" : "items-start")}>
      <motion.div {...fade(0)} className="flex flex-wrap items-center gap-2">
        <span className="eyebrow">{slide.kicker}</span>
      </motion.div>
      {slide.partnerBadge ? (
        <motion.div {...fade(0.05)} className="mt-3">
          <PartnerBadge label={slide.partnerBadge} />
        </motion.div>
      ) : null}
      <div className="mt-4">
        <Headline slide={slide} play={play} />
      </div>
      <motion.p {...fade(0.35)} className="mt-3 max-w-md text-base leading-relaxed text-ink/70 md:mt-5 md:text-xl">
        {slide.sub}
      </motion.p>
      {slide.badge ? (
        <motion.span {...fade(0.42)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-sage-800 px-4 py-2 text-[13px] font-medium text-white">
          <FlaskConical size={14} className="text-gold-bright" />
          {slide.badge}
        </motion.span>
      ) : null}
      <motion.ul {...fade(0.5)} className="mt-5 hidden flex-wrap gap-2 md:flex">
        {slide.benefits.map((b) => (
          <li key={b} className="glass flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] text-ink/80">
            <Sparkles size={13} className="text-gold" />
            {b}
          </li>
        ))}
      </motion.ul>
      <motion.div {...fade(0.6)} className="mt-5 flex flex-wrap gap-3 md:mt-8">
        {slide.primaryCta.href.startsWith("#") ? (
          <GoldButton href={slide.primaryCta.href}>
            {slide.primaryCta.label} <ArrowRight size={16} />
          </GoldButton>
        ) : (
          <GoldButton to={slide.primaryCta.href}>
            {slide.primaryCta.label} <ArrowRight size={16} />
          </GoldButton>
        )}
        {slide.secondaryCta ? (
          slide.secondaryCta.href.startsWith("#") ? (
            <GoldButton variant="glass" href={slide.secondaryCta.href}>{slide.secondaryCta.label}</GoldButton>
          ) : (
            <GoldButton variant="glass" to={slide.secondaryCta.href}>{slide.secondaryCta.label}</GoldButton>
          )
        ) : null}
      </motion.div>
    </div>
  )
}

function SlideImage({ slide, play }: { slide: HeroSlide; play: boolean }) {
  const right = slide.layout === "text-right"
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={play ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="hero-image relative h-full w-full"
    >
      <div className="relative h-full w-full overflow-hidden rounded-[36px] shadow-[0_40px_80px_-40px_rgba(58,81,48,0.55)] ring-1 ring-white md:rounded-[44px]">
        <img
          src={slide.image}
          alt=""
          className="ken absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: slide.imagePosition }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(38,50,31,0.18))]" />
      </div>
      {slide.chips.map((chip, i) => {
        const Icon = chipIcons[chip.icon]
        const pos =
          i === 0
            ? right ? "top-6 -right-3 md:right-5" : "top-8 -left-3 md:-left-8"
            : right ? "bottom-8 -left-3 md:-left-8" : "bottom-10 -right-3 md:-right-6"
        return (
          <motion.div
            key={chip.title}
            initial={{ opacity: 0, y: 20 }}
            animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.7 + i * 0.15 }}
            className={cn("absolute z-10", pos, i > 0 && "hidden md:block")}
          >
            <div className="float glass flex items-center gap-3 rounded-2xl py-2.5 pr-4 pl-2.5" style={{ animationDelay: `${i * 1.4}s` }}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl gold-fill text-white">
                <Icon size={18} />
              </span>
              <span className="leading-tight">
                <span className="block text-[15px] font-semibold text-ink">{chip.title}</span>
                <span className="block text-xs text-ink/60">{chip.sub}</span>
              </span>
            </div>
          </motion.div>
        )
      })}
      <Droplet className={cn("float absolute w-10", right ? "-top-5 left-[18%]" : "-top-5 right-[22%]")} />
      <Droplet className={cn("float absolute w-6", right ? "right-[12%] -bottom-3" : "bottom-[-10px] left-[30%]")} style={{ animationDelay: "2s" }} />
    </motion.div>
  )
}

function Slide({
  slide,
  play,
  className,
  style,
}: {
  slide: HeroSlide
  play: boolean
  className?: string
  style?: React.CSSProperties
}) {
  const right = slide.layout === "text-right"
  return (
    <div className={cn("absolute inset-0 isolate", className)} style={style}>
      <div className="mx-auto grid h-full max-w-7xl grid-rows-[auto_1fr] items-center gap-5 px-5 pt-24 pb-8 md:grid-cols-12 md:grid-rows-1 md:gap-10 md:px-8 md:pt-24 md:pb-14">
        <div className={cn("md:col-span-5", right ? "md:order-2 md:col-start-8" : "md:order-1")}>
          <SlideText slide={slide} play={play} />
        </div>
        <div className={cn("h-full max-h-[640px] min-h-[260px] md:col-span-7 md:h-[74vh]", right ? "md:order-1" : "md:order-2")}>
          <SlideImage slide={slide} play={play} />
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const slides = getHeroSlides()
  const { loading } = useUI()
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const stRef = useRef<ScrollTrigger | null>(null)

  useEffect(() => {
    registerGsap()
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=110%",
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            setProgress(self.progress)
            setActive(self.progress > 0.45 ? 1 : 0)
          },
        },
      })
      stRef.current = tl.scrollTrigger ?? null
      tl.to(".slide-a .ken", { scale: 1.12, ease: "none", duration: 0.5 }, 0)
        .to(".slide-a .hero-text", { y: -60, opacity: 0, ease: "power2.in", duration: 0.35 }, 0.15)
        .to(".slide-a .hero-image", { scale: 0.86, opacity: 0, ease: "power2.in", duration: 0.4 }, 0.2)
        .fromTo(
          ".slide-b",
          { clipPath: "circle(0% at 50% 55%)" },
          { clipPath: "circle(150% at 50% 55%)", ease: "power2.inOut", duration: 0.6 },
          0.3,
        )
        .fromTo(".slide-b .ken", { scale: 1.2 }, { scale: 1, ease: "none", duration: 0.7 }, 0.3)
    }, el)
    return () => ctx.revert()
  }, [])

  const goTo = (i: number) => {
    const st = stRef.current
    if (!st) return
    const y = i === 0 ? st.start : st.end
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 1.2 })
    else window.scrollTo({ top: y, behavior: "smooth" })
  }

  return (
    <section ref={root} className="relative h-svh min-h-[640px] overflow-hidden dewy">
      <Bubbles className="opacity-70" count={8} />
      <Slide slide={slides[0]} play={!loading} className="slide-a" />
      <Slide
        slide={slides[1]}
        play={!loading && active === 1}
        className="slide-b dewy-sage"
        style={{ clipPath: "circle(0% at 50% 55%)" }}
      />

      <div className="absolute right-5 bottom-5 z-20 hidden items-center gap-2 md:right-8 md:flex">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            className={cn(
              "glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition",
              active === i ? "text-ink" : "text-ink/45",
            )}
            aria-label={`Go to slide ${i + 1}`}
          >
            0{i + 1}
            <span className="relative h-0.5 w-8 overflow-hidden rounded-full bg-sage-200">
              <span
                className="absolute inset-y-0 left-0 gold-fill"
                style={{ width: `${i === 0 ? Math.min(1, progress / 0.45) * 100 : Math.max(0, (progress - 0.45) / 0.55) * 100}%` }}
              />
            </span>
          </button>
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-[11px] tracking-[0.3em] text-ink/50 uppercase md:flex">
        <span className="flex h-8 w-5 justify-center rounded-full border border-ink/25 pt-1.5">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-gold"
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </span>
        Scroll
      </div>
    </section>
  )
}
