import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { CartDrawer } from "@/components/CartDrawer"
import { DraftBadge } from "@/components/DraftBadge"
import { Footer } from "@/components/Footer"
import { GrainOverlay } from "@/components/GrainOverlay"
import { Loader } from "@/components/Loader"
import { Navbar } from "@/components/Navbar"
import { QuickViewDrawer } from "@/components/QuickViewDrawer"
import { ScrollProgress } from "@/components/ScrollProgress"
import { useTheme } from "@/context/ThemeContext"
import { useUI } from "@/context/UIContext"
import { scrollToHash, useLenis } from "@/hooks/useLenis"
import { registerGsap, ScrollTrigger } from "@/lib/gsap"
import { HomePage } from "@/pages/HomePage"
import { ProductPage } from "@/pages/ProductPage"

export default function App() {
  const { loading } = useUI()
  const location = useLocation()
  const { theme } = useTheme()
  useLenis(!loading, theme === "a" ? 1.7 : 1.15)

  useEffect(() => {
    registerGsap()
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => window.clearTimeout(id)
  }, [location.pathname, loading])

  useEffect(() => {
    if (!location.hash || loading) return
    const id = window.setTimeout(() => scrollToHash(location.hash), 500)
    return () => window.clearTimeout(id)
  }, [location.hash, location.pathname, loading])

  return (
    <>
      <Loader />
      <GrainOverlay />
      <ScrollProgress />
      <DraftBadge />
      <Navbar />
      <CartDrawer />
      <QuickViewDrawer />
      {/* Opacity-only transition: a transform here would break GSAP pinning. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
          </Routes>
          <Footer />
        </motion.div>
      </AnimatePresence>
    </>
  )
}
