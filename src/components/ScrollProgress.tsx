import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 })

  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-[linear-gradient(90deg,#93ad86,#e3b341,#b8860b)]"
      style={{ scaleX }}
    />
  )
}
