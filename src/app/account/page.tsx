"use client"

import { CheckCircle2, Heart, Lock, Mail, MapPin, Pencil, Plus, Shield, UserRound } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { AccountCard, Avatar, StatusChip, fieldClass, formatDate, thumbSrc } from "@/components/account/ui"
import { InlineBusy } from "@/components/Busy"
import { GoldButton } from "@/components/GoldButton"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/format"
import type { Product } from "@/data/products"

type Order = {
  _id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  lines?: { name?: string; image?: string; quantity?: number }[]
}

export default function AccountPage() {
  const { user, refresh } = useAuth()
  const [editing, setEditing] = useState(false)
  const [pending, setPending] = useState(false)
  const [pwOpen, setPwOpen] = useState(false)
  const [twoFa, setTwoFa] = useState(false)
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [wishlist, setWishlist] = useState<Product[] | null>(null)

  useEffect(() => {
    api<{ orders: Order[] }>("/api/orders")
      .then((d) => setOrders(d.orders))
      .catch(() => setOrders([]))
    api<{ products: Product[] }>("/api/wishlist")
      .then((d) => setWishlist(d.products))
      .catch(() => setWishlist([]))
  }, [])

  if (!user) return null

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending(true)
    try {
      await api("/api/account/profile", {
        method: "PATCH",
        body: JSON.stringify({ name: form.get("name"), phone: form.get("phone") }),
      })
      await refresh()
      setEditing(false)
      toast.success("Profile updated")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile")
    } finally {
      setPending(false)
    }
  }

  const changePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    try {
      const data = await api<{ message: string }>("/api/account/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: form.get("currentPassword"), newPassword: form.get("newPassword") }),
      })
      toast.success(data.message)
      setPwOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not change password")
    }
  }

  const defaultAddress = user.addresses.find((a) => a.isDefault) ?? user.addresses[0]
  const firstName = user.name.split(" ")[0] || user.name

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="mt-2 text-4xl md:text-5xl">My Account</h1>
          <p className="mt-2 max-w-xl text-sm text-ink/55">
            Welcome back to Noor E Derma. Manage your profile, orders, addresses and more.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-[22px] bg-white px-4 py-3 ring-1 ring-sage-100">
          <Avatar name={user.name} />
          <div className="min-w-0">
            <p className="font-medium">Hi, {firstName}</p>
            <p className="truncate text-[12px] text-ink/50">{user.email}</p>
            {user.emailVerified ? (
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                <CheckCircle2 size={12} /> Email Verified
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-amber-800">Verify your email</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <AccountCard>
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg">
              <UserRound size={18} className="text-gold-deep" /> Account Details
            </h2>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-medium text-gold-deep ring-1 ring-gold/30"
              onClick={() => setEditing((v) => !v)}
            >
              <Pencil size={12} /> {editing ? "Cancel" : "Edit"}
            </button>
          </div>
          <form onSubmit={save} className="space-y-3">
            <label className="grid gap-1.5 sm:grid-cols-[7.5rem_1fr] sm:items-center">
              <span className="text-[12px] font-medium text-ink/55">Full Name</span>
              <input name="name" defaultValue={user.name} disabled={!editing} className={fieldClass} />
            </label>
            <label className="grid gap-1.5 sm:grid-cols-[7.5rem_1fr] sm:items-center">
              <span className="text-[12px] font-medium text-ink/55">Email</span>
              <span className={`${fieldClass} flex items-center justify-between gap-2`}>
                <span className="truncate">{user.email}</span>
                {user.emailVerified ? (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-emerald-700">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                ) : null}
              </span>
            </label>
            <label className="grid gap-1.5 sm:grid-cols-[7.5rem_1fr] sm:items-center">
              <span className="text-[12px] font-medium text-ink/55">Phone</span>
              <input name="phone" defaultValue={user.phone} disabled={!editing} placeholder="+91" className={fieldClass} />
            </label>
            {editing ? (
              <div className="pt-2">
                <GoldButton type="submit" size="sm" loading={pending}>
                  {pending ? "Saving" : "Save Changes"}
                </GoldButton>
              </div>
            ) : null}
          </form>
        </AccountCard>

        <AccountCard>
          <h2 className="mb-5 flex items-center gap-2 text-lg">
            <Shield size={18} className="text-gold-deep" /> Password & Security
          </h2>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-3">
                <Lock size={16} className="mt-0.5 text-ink/40" />
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="text-[12px] text-ink/50">Keep your account secure with a strong password.</p>
                </div>
              </div>
              <GoldButton variant="outline" className="px-4 py-2 text-[11px]" onClick={() => setPwOpen((v) => !v)}>
                Change Password
              </GoldButton>
            </div>
            {pwOpen ? (
              <form onSubmit={changePassword} className="space-y-2 rounded-2xl bg-[#faf6ec] p-4">
                <input name="currentPassword" type="password" required placeholder="Current password" className={fieldClass} />
                <input name="newPassword" type="password" required minLength={8} placeholder="New password" className={fieldClass} />
                <GoldButton type="submit" className="px-5 py-2 text-[12px]">
                  Update password
                </GoldButton>
              </form>
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-3">
                <Mail size={16} className="mt-0.5 text-ink/40" />
                <div>
                  <p className="text-sm font-medium">Email Verification</p>
                  <p className="text-[12px] text-ink/50">
                    {user.emailVerified ? "Your email is verified." : "Check your inbox for a verification link."}
                  </p>
                </div>
              </div>
              {user.emailVerified ? (
                <span className="inline-flex items-center gap-1 text-[12px] font-medium text-emerald-700">
                  <CheckCircle2 size={14} /> Verified
                </span>
              ) : (
                <span className="text-[12px] text-amber-800">Pending</span>
              )}
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-3">
                <Shield size={16} className="mt-0.5 text-ink/40" />
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication (2FA)</p>
                  <p className="text-[12px] text-ink/50">Add an extra layer of security to your account.</p>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={twoFa}
                onClick={() => {
                  setTwoFa((v) => !v)
                  toast("Two-factor authentication will be available at launch.")
                }}
                className={`relative h-6 w-11 rounded-full transition ${twoFa ? "gold-fill" : "bg-sage-100"}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${twoFa ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </AccountCard>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <AccountCard>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg">
              <MapPin size={18} className="text-gold-deep" /> Addresses
            </h2>
            <Link href="/account/addresses" className="inline-flex items-center gap-1 text-[12px] font-medium text-gold-deep">
              <Plus size={12} /> Add Address
            </Link>
          </div>
          {defaultAddress ? (
            <div className="rounded-2xl bg-[#faf6ec] p-4">
              {defaultAddress.isDefault ? (
                <span className="mb-2 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-medium tracking-wide text-gold-deep uppercase ring-1 ring-gold/20">
                  Default
                </span>
              ) : null}
              <p className="font-medium">{defaultAddress.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">
                {defaultAddress.line1}
                {defaultAddress.line2 ? `, ${defaultAddress.line2}` : ""}
                <br />
                {defaultAddress.city}, {defaultAddress.state} – {defaultAddress.pincode}
              </p>
              <p className="mt-2 text-[12px] text-ink/50">{defaultAddress.phone}</p>
            </div>
          ) : (
            <p className="text-sm text-ink/50">No addresses yet. Add one for faster checkout.</p>
          )}
        </AccountCard>

        <AccountCard className="overflow-hidden">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg">Recent Orders</h2>
            <Link href="/account/orders" className="text-[12px] font-medium text-gold-deep">
              View All Orders →
            </Link>
          </div>
          {orders == null ? (
            <InlineBusy label="Loading orders" />
          ) : orders.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-[11px] tracking-wide text-ink/40 uppercase">
                  <tr>
                    <th className="pb-2 font-medium">Order</th>
                    <th className="pb-2 font-medium">Items</th>
                    <th className="pb-2 font-medium">Total</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 4).map((o) => {
                    const first = o.lines?.[0]
                    const extra = (o.lines?.length ?? 0) - 1
                    return (
                      <tr key={o._id} className="border-t border-sage-50">
                        <td className="py-3">
                          <Link href={`/account/orders/${o.orderNumber}`} className="font-medium hover:underline">
                            #{o.orderNumber}
                          </Link>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            {first?.image ? (
                              <img src={first.image} alt="" className="h-9 w-9 rounded-lg object-contain bg-[#faf6ec]" />
                            ) : null}
                            <div>
                              <p className="max-w-[9rem] truncate text-[13px]">{first?.name ?? "Items"}</p>
                              {extra > 0 ? <p className="text-[11px] text-ink/40">+{extra} more</p> : null}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-medium">{formatINR(o.total)}</td>
                        <td className="py-3">
                          <StatusChip status={o.status} />
                        </td>
                        <td className="py-3 text-[12px] text-ink/50">{formatDate(o.createdAt)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-ink/50">No orders yet. Your first ritual will land here.</p>
          )}
        </AccountCard>
      </div>

      <AccountCard className="mt-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg">
              <Heart size={18} className="text-gold-deep" /> My Wishlist
            </h2>
            <p className="mt-1 text-[12px] text-ink/65">Your saved products for later ({wishlist?.length ?? 0} items)</p>
          </div>
          <Link href="/account/wishlist" className="text-[12px] font-medium text-gold-deep">
            View Wishlist →
          </Link>
        </div>
        {wishlist == null ? (
          <InlineBusy label="Loading wishlist" />
        ) : wishlist.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {wishlist.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Link href={`/product/${p.slug}`} className="flex items-center gap-3 rounded-2xl bg-[#faf6ec] p-3">
                  <span className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                    <img src={thumbSrc(p.images)} alt={p.name} className="h-full w-full object-contain p-1" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-pcard !text-[15px] leading-tight">{p.name}</p>
                    <p className="mt-1 text-sm font-medium">{formatINR(p.price)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink/50">Nothing saved yet. Tap the heart on a product to keep it here.</p>
        )}
      </AccountCard>
    </div>
  )
}
