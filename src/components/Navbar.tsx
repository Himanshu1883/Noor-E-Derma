import { AnimatePresence, motion } from "framer-motion"
import { Menu, ShoppingBag, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { GoldButton } from "@/components/GoldButton"
import { Logo } from "@/components/Logo"
import { useCart } from "@/context/CartContext"
import { useUI } from "@/context/UIContext"
import { scrollToHash } from "@/hooks/useLenis"
import { cn } from "@/lib/cn"

const links = [
  { label: "Shop", href: "#shop" },
  { label: "Ingredients", href: "#ingredients" },
  { label: "Results", href: "#results" },
  { label: "Reviews", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
]

export function Navbar() {
  const { count } = useCart()
  const { setCartOpen } = useUI()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  const go = (hash: string) => {
    setOpen(false)
    if (location.pathname !== "/") {
      navigate(`/${hash}`)
      return
    }
    scrollToHash(hash)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6">
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full px-4 py-2 transition-all duration-500 md:px-6",
          scrolled ? "glass" : "border border-transparent",
        )}
      >
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => go(link.href)}
              className="rounded-full px-4 py-2 text-[14px] text-ink/75 transition hover:bg-sage-50 hover:text-sage-800"
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-ink transition hover:bg-sage-50"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingBag size={18} />
            <AnimatePresence>
              {count > 0 ? (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full gold-fill px-1 text-[10px] font-semibold text-white"
                >
                  {count}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </button>
          <span className="hidden sm:block">
            <GoldButton className="px-5 py-2.5" onClick={() => go("#shop")}>
              Shop Now
            </GoldButton>
          </span>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass mx-auto mt-2 flex max-w-7xl flex-col rounded-3xl p-3 lg:hidden"
          >
            {links.map((link) => (
              <button
                key={link.href}
                type="button"
                className="rounded-2xl px-4 py-3 text-left text-[15px] hover:bg-sage-50"
                onClick={() => go(link.href)}
              >
                {link.label}
              </button>
            ))}
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
