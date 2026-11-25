"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { AuthModal } from "@/components/auth/AuthModal"
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
import { getLenis, scrollToHash, useLenis } from "@/hooks/useLenis"
import { registerGsap, ScrollTrigger } from "@/lib/gsap"

const BARE = new Set(["/forgot-password", "/reset-password", "/verify-email"])

export function AppShell({ children }: { children: React.ReactNode }) {
  const { loading } = useUI()
  const pathname = usePathname()
  const { theme } = useTheme()
  const bare = pathname.startsWith("/admin") || pathname.startsWith("/account") || BARE.has(pathname)
  useLenis(!loading && !bare, theme === "a" ? 1.7 : 1.15)

  useEffect(() => {
    if (bare) return
    registerGsap()
    getLenis()?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    document.documentElement.style.overflow = ""
    document.body.style.overflow = ""
    document.body.style.height = ""
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => {
      window.clearTimeout(id)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [pathname, bare])

  useEffect(() => {
    if (loading || bare) return
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 250)
    return () => window.clearTimeout(id)
  }, [loading, bare])

  useEffect(() => {
    if (loading || bare) return
    const hash = window.location.hash
    if (!hash) return
    const id = window.setTimeout(() => scrollToHash(hash), 500)
    return () => window.clearTimeout(id)
  }, [pathname, loading, bare])

  if (bare) return <>{children}</>

  return (
    <>
      <Loader />
      <GrainOverlay />
      <ScrollProgress />
      <DraftBadge />
      <Navbar />
      <AuthModal />
      <CartDrawer />
      <QuickViewDrawer />
      <div>
        {children}
        <Footer />
      </div>
    </>
  )
}
