import { getLenis } from "@/hooks/useLenis"
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap"

/** Re-measure pinned sections and scrub timelines after layout/theme changes (Lenis resize alone is not enough). */
export function refreshMotionLayout(opts?: { clearHero?: boolean }) {
  if (typeof window === "undefined") return
  registerGsap()
  getLenis()?.resize()
  if (opts?.clearHero) {
    gsap.set(".hero-image, .slide-a .ken, .slide-b .ken", { clearProps: "opacity,transform" })
  }
  requestAnimationFrame(() => {
    ScrollTrigger.refresh(true)
    requestAnimationFrame(() => ScrollTrigger.update())
  })
}