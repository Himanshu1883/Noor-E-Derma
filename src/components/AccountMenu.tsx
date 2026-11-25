"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Heart, LogOut, Package, UserRound } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/context/AuthContext"

const LINKS = [
  { href: "/account", label: "Profile", icon: UserRound },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/orders", label: "Orders", icon: Package },
]

export function AccountMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("pointerdown", onPointer)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("pointerdown", onPointer)
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  if (!user) return null

  if (user.role === "admin") {
    return (
      <Link
        href="/admin"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-ink"
        aria-label="Admin"
      >
        <UserRound size={18} />
      </Link>
    )
  }

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-ink transition hover:bg-sage-50"
        aria-label="Account"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <UserRound size={18} />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute top-[calc(100%+8px)] right-0 z-30 w-[13.5rem] overflow-hidden rounded-2xl bg-ivory p-1.5 shadow-[0_16px_40px_-24px_rgb(var(--tint)/0.55)] ring-1 ring-sage-100"
          >
            <p className="truncate px-3 pt-2 pb-1.5 text-[11px] text-ink/45">{user.email}</p>
            {LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink/80 hover:bg-sage-50"
              >
                <item.icon size={15} className="text-ink/45" />
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-ink/70 hover:bg-sage-50"
              onClick={async () => {
                setOpen(false)
                await logout()
              }}
            >
              <LogOut size={15} className="text-ink/45" />
              Sign out
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
