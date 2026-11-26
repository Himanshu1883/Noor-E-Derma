import { useEffect, useRef } from "react"
import { refreshMotionLayout } from "@/lib/motion-refresh"
import Lenis from "lenis"
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap"

let lenis: Lenis | null = null

export function getLenis() {
  return lenis
}

export function scrollToHash(hash: string) {
  const id = hash.replace("#", "")
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset: -72, duration: 1.15 })
    return
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function useLenis(enabled: boolean, duration = 1.15) {
  const durationRef = useRef(duration)
  durationRef.current = duration

  useEffect(() => {
    if (typeof window === "undefined") return
    registerGsap()
    if (!enabled) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const instance = new Lenis({
      autoRaf: false,
      duration: reduced ? 0.4 : durationRef.current,
      smoothWheel: !reduced,
      prevent: (node) => node.closest("[data-lenis-prevent]") != null,
    })
    lenis = instance

    instance.on("scroll", ScrollTrigger.update)

    const ticker = (time: number) => {
      instance.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener("resize", onResize)
    const sync = window.setTimeout(() => refreshMotionLayout(), 0)

    return () => {
      window.clearTimeout(sync)
      window.removeEventListener("resize", onResize)
      gsap.ticker.remove(ticker)
      instance.destroy()
      if (lenis === instance) lenis = null
    }
  }, [enabled])
}
