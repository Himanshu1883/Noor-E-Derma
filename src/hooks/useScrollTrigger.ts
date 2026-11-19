import { useLayoutEffect, type DependencyList, type RefObject } from "react"
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap"

export function useScrollTrigger(
  factory: () => void,
  ref: RefObject<HTMLElement | null>,
  deps: DependencyList = [],
) {
  useLayoutEffect(() => {
    registerGsap()
    const ctx = gsap.context(() => {
      factory()
    }, ref)
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => {
      cancelAnimationFrame(id)
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
