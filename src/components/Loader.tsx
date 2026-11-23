"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { Droplet } from "@/components/Bubbles"
import { ASSETS, BRAND } from "@/data/config"
import { useUI } from "@/context/UIContext"

export function Loader() {
  const { loading, setLoading } = useUI()

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 1600)
    return () => window.clearTimeout(t)
  }, [setLoading])

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          className="dewy fixed inset-0 z-[100] flex flex-col items-center justify-center"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="shine relative overflow-hidden"
          >
            <img src={ASSETS.logo} alt={BRAND.name} className="h-28 w-auto md:h-36" />
          </motion.div>
          <motion.div
            className="mt-8 h-[3px] w-48 overflow-hidden rounded-full bg-sage-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full gold-fill"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          </motion.div>
          <p className="eyebrow mt-5">{BRAND.tagline}</p>
          <Droplet className="float absolute top-[22%] left-[18%] w-8 opacity-80" />
          <Droplet className="float absolute right-[20%] bottom-[24%] w-12" style={{ animationDelay: "1.2s" }} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
