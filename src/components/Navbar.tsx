"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Menu, ShoppingBag, UserRound, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { AccountMenu } from "@/components/AccountMenu"
import { GoldButton } from "@/components/GoldButton"
import { Logo } from "@/components/Logo"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { useUI } from "@/context/UIContext"
import { NAV_MORE, NAV_PRIMARY } from "@/data/site"
import { getLenis } from "@/hooks/useLenis"
import { cn } from "@/lib/cn"

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

function MenuLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string
  label: string
  active: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "block rounded-2xl px-3 py-2.5 text-[16px] font-medium transition md:text-[17px]",
        active ? "bg-sage-50 text-sage-800" : "text-ink hover:bg-sage-50",
      )}
    >
      {label}
    </Link>
  )
}

export function Navbar() {
  const { count } = useCart()
  const { cartOpen, setCartOpen, openAuth } = useUI()
  const { user } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [more, setMore] = useState(false)
  const pathname = usePathname()
  const onCheckout = pathname === "/checkout" || pathname.startsWith("/checkout/")
  const [badge, setBadge] = useState(count)
  const badgeLocked = useRef(false)

  useEffect(() => {
    if (!onCheckout) {
      badgeLocked.current = false
      setBadge(count)
      return
    }
    if (cartOpen) setCartOpen(false)
    if (!badgeLocked.current) {
      setBadge(count)
      if (count > 0) badgeLocked.current = true
    }
  }, [count, onCheckout, cartOpen, setCartOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setMore(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const lenis = getLenis()
    document.body.style.overflow = "hidden"
    lenis?.stop()
    return () => {
      document.body.style.overflow = ""
      lenis?.start()
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6">
      <div
        className={cn(
          "relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-visible rounded-full px-4 py-2 transition-all duration-500 md:px-6",
          open || scrolled ? "bg-ivory ring-1 ring-sage-100 shadow-[0_12px_40px_-24px_rgb(var(--tint)/0.45)]" : "border border-transparent",
        )}
      >
        <Logo />
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_PRIMARY.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-2 text-[14px] font-medium transition hover:bg-sage-50 hover:text-sage-800",
                isActive(pathname, link.href) ? "text-sage-800" : "text-ink/75",
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMore((v) => !v)}
              className="flex items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium text-ink/75 transition hover:bg-sage-50 hover:text-sage-800"
              aria-expanded={more}
            >
              More <ChevronDown size={14} className={cn("transition", more && "rotate-180")} />
            </button>
            <AnimatePresence>
              {more ? (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute top-[calc(100%+8px)] right-0 z-20 min-w-[200px] rounded-2xl bg-ivory p-2 ring-1 ring-sage-100 shadow-xl"
                >
                  {NAV_MORE.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-xl px-3 py-2 text-[13px] font-medium text-ink/75 hover:bg-sage-50 hover:text-sage-800"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <AccountMenu />
          ) : (
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-ink"
              aria-label="Sign in"
              onClick={() => {
                setOpen(false)
                openAuth("login")
              }}
            >
              <UserRound size={18} />
            </button>
          )}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-ink transition hover:bg-sage-50"
            onClick={() => {
              if (onCheckout) return
              setCartOpen(true)
            }}
            aria-label="Open cart"
          >
            <ShoppingBag size={18} />
            <AnimatePresence>
              {badge > 0 ? (
                <motion.span
                  key={onCheckout ? "checkout" : badge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full gold-fill px-1 text-[10px] font-semibold text-white"
                >
                  {badge}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </button>
          <span className="hidden sm:block">
            <GoldButton className="px-5 py-2.5" to="/shop">
              Shop Now
            </GoldButton>
          </span>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10 bg-ivory/95 backdrop-blur-xl lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 mx-auto mt-2 flex max-h-[calc(100svh-5.75rem)] max-w-7xl flex-col overflow-y-auto rounded-[28px] bg-ivory p-5 shadow-[0_24px_60px_-28px_rgb(var(--tint)/0.45)] ring-1 ring-sage-100 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:p-7 lg:hidden"
            >
              <div className="grid gap-8 md:grid-cols-2 md:gap-12">
                <div>
                  <p className="eyebrow">Menu</p>
                  <div className="mt-3 flex flex-col">
                    {NAV_PRIMARY.map((link) => (
                      <MenuLink
                        key={link.href}
                        href={link.href}
                        label={link.label}
                        active={isActive(pathname, link.href)}
                        onClick={() => setOpen(false)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="eyebrow">More</p>
                  <div className="mt-3 flex flex-col">
                    {NAV_MORE.map((link) => (
                      <MenuLink
                        key={link.href}
                        href={link.href}
                        label={link.label}
                        active={isActive(pathname, link.href)}
                        onClick={() => setOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:hidden">
                <GoldButton className="w-full" to="/shop" onClick={() => setOpen(false)}>
                  Shop Now
                </GoldButton>
              </div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
