"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowUpRight,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Tag,
  UserRound,
  Users,
  Warehouse,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Logo } from "@/components/Logo"
import { useAuth } from "@/context/AuthContext"
import { initials } from "@/components/admin/ui"
import { api } from "@/lib/client"
import { cn } from "@/lib/cn"

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inventory", label: "Inventory", icon: Warehouse },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/password-resets", label: "Password resets", icon: KeyRound },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/profile", label: "Profile", icon: UserRound },
]

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    for (const link of links) router.prefetch(link.href)
    const id = window.setTimeout(() => {
      void Promise.allSettled([
        api("/api/admin/summary"),
        api("/api/admin/products"),
        api("/api/admin/inventory"),
        api("/api/admin/users"),
        api("/api/admin/password-resets"),
        api("/api/admin/coupons"),
        api("/api/admin/orders"),
        api("/api/admin/settings"),
      ])
    }, 120)
    return () => window.clearTimeout(id)
  }, [router])

  const signOut = async () => {
    await logout()
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
              "flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-[13px] whitespace-nowrap transition",
              active ? "bg-sage-50 text-sage-800 ring-1 ring-sage-100" : "text-ink/65 hover:bg-sage-50/70 hover:text-ink",
            )}
          >
            <Icon size={16} />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-svh bg-[#fbf6ea] text-ink">
      <div className="lg:grid lg:grid-cols-[260px_1fr]">
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
              className="mt-4 hidden items-center justify-between rounded-2xl bg-sage-50 px-3 py-2.5 text-[12px] text-sage-800 ring-1 ring-sage-100 lg:flex"
            >
              <span className="inline-flex items-center gap-2">
                <Store size={14} /> Back to shop
              </span>
              <ArrowUpRight size={14} />
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
              <span className="grid h-10 w-10 place-items-center rounded-full bg-sage-800 text-[12px] font-medium text-white">
                {initials(user?.name || user?.email)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">{user?.name || "Admin"}</p>
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
          </div>
        </aside>
        <div className="min-w-0 px-4 py-6 md:px-8 md:py-8">
          <div className="mb-5 flex items-center justify-between lg:hidden">
            <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] text-sage-800">
              <Store size={14} /> Back to shop
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
