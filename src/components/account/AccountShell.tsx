"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  CircleHelp,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Shield,
  ShoppingBag,
  Store,
  UserRound,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Avatar } from "@/components/account/ui"
import { Logo } from "@/components/Logo"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/cn"

const links = [
  { href: "/account", label: "Profile", icon: UserRound },
  { href: "/account/orders", label: "Orders", icon: ShoppingBag },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/security", label: "Security", icon: Shield },
  { href: "/account/help", label: "Help", icon: CircleHelp },
]

function isActive(pathname: string, href: string) {
  if (href === "/account") return pathname === "/account"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const signOut = async () => {
    await logout()
    toast.success("Signed out")
    router.push("/")
  }

  const nav = (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3">
      {links.map((link) => {
        const Icon = link.icon
        const active = isActive(pathname, link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-[13px] font-medium whitespace-nowrap transition",
              active ? "bg-[#f3e6c8] text-gold-deep" : "text-ink/60 hover:bg-[#faf6ec] hover:text-ink",
            )}
          >
            <Icon size={16} />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )

  if (loading) {
    return <div className="min-h-svh bg-[#fbf6ea]" />
  }

  return (
    <div className="min-h-svh bg-[#fbf6ea] text-ink">
      <div className="lg:grid lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-sage-100 bg-ivory lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block lg:px-5 lg:pt-6">
            <Logo imgClassName="h-10 md:h-11" />
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-sage-100 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
            <Link
              href="/"
              className="mt-5 hidden items-center gap-2 rounded-2xl bg-[#faf6ec] px-3 py-2.5 text-[12px] font-medium text-sage-800 ring-1 ring-sage-100 lg:flex"
            >
              <Store size={14} /> Back to shop
            </Link>
          </div>
          <div className="hidden lg:block">{nav}</div>
          <AnimatePresence>
            {open ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden lg:hidden"
              >
                {nav}
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div className="mt-auto hidden border-t border-sage-100 px-4 py-4 lg:block">
            <div className="flex items-center gap-3">
              <Avatar name={user?.name} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">{user?.name}</p>
                <p className="truncate text-[11px] text-ink/45">{user?.email}</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-ink/50 hover:text-ink"
              onClick={() => void signOut()}
            >
              <LogOut size={13} /> Sign out
            </button>
            {user?.role === "admin" ? (
              <Link href="/admin" className="mt-2 flex items-center gap-1.5 text-[12px] text-gold-deep">
                <LayoutDashboard size={13} /> Admin
              </Link>
            ) : null}
          </div>
        </aside>
        <div className="min-w-0 px-4 py-5 md:px-8 md:py-8">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-sage-800">
              <Store size={14} /> Shop
            </Link>
            <button type="button" className="text-[12px] text-ink/50" onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
