"use client"

import { Lock, ShoppingBag, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { PageBusy, PrefillOverlay } from "@/components/Busy"
import { QuantityStepper } from "@/components/QuantityStepper"
import { RazorpaySecure } from "@/components/pay/PayMarks"
import { PaymentPanel } from "@/components/pay/PaymentPanel"
import { useAuth } from "@/context/AuthContext"
import { useCart, type CartLine } from "@/context/CartContext"
import type { PublicAddress } from "@/lib/auth/types"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/format"

type Quote = {
  cart: { subtotal: number }
  totals: {
    subtotal: number
    discount: number
    shippingFee: number
    tax: number
    total: number
    couponCode: string
    settings?: { shippingFee: number; freeShippingOver: number; taxPercent: number }
  }
  profile: { name: string; email: string; phone: string; addresses: PublicAddress[] }
  razorpayEnabled?: boolean
  codEnabled?: boolean
  paymentsEnabled?: boolean
  minOrderAmount?: number
  estimatedDelivery?: string
}

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void }
  }
}

const field =
  "mt-1.5 w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-ink outline-none ring-1 ring-sage-100 placeholder:text-ink/35 focus:ring-gold/45 disabled:opacity-70"
const label = "text-[12px] font-medium tracking-[0.04em] text-ink/70"

type Ship = {
  name: string
  email: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
}

const emptyShip: Ship = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
}

function cover(images?: { src: string; type?: string }[]) {
  return images?.find((img) => img.type !== "video" && img.src) ?? images?.[0]
}

export default function CheckoutPage() {
  const { user } = useAuth()
  const { lines: bag, ready, refresh } = useCart()
  const router = useRouter()
  const [draft, setDraft] = useState<CartLine[] | null>(null)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [pending, setPending] = useState(false)
  const [couponBusy, setCouponBusy] = useState(false)
  const [coupon, setCoupon] = useState("")
  const [method, setMethod] = useState<"razorpay" | "cod">("razorpay")
  const [ship, setShip] = useState<Ship>(emptyShip)
  const [prefilled, setPrefilled] = useState(false)
  const lines = draft ?? bag
  const qtyTimers = useRef<Record<string, number>>({})
  const qtyPending = useRef<Record<string, { productId: string; quantity: number }>>({})

  useEffect(() => {
    if (!ready) return
    setDraft((current) => current ?? bag.map((line) => ({ ...line, product: { ...line.product } })))
  }, [ready, bag])

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    let reveal: number | undefined
    const started = Date.now()
    const finish = () => {
      const wait = Math.max(0, 560 - (Date.now() - started))
      reveal = window.setTimeout(() => {
        if (!cancelled) setPrefilled(true)
      }, wait)
    }
    api<Quote>("/api/checkout")
      .then((data) => {
        if (cancelled) return
        setQuote(data)
        setCoupon((code) => code || data.totals.couponCode || "")
        if (data.razorpayEnabled === false && data.codEnabled !== false) setMethod("cod")
        else if (data.codEnabled === false && data.razorpayEnabled) setMethod("razorpay")
        const saved = data.profile.addresses.find((a) => a.isDefault) ?? data.profile.addresses[0]
        setShip({
          name: data.profile.name || saved?.name || user?.name || "",
          email: data.profile.email || user?.email || "",
          phone: data.profile.phone || saved?.phone || user?.phone || "",
          line1: saved?.line1 || "",
          line2: saved?.line2 || "",
          city: saved?.city || "",
          state: saved?.state || "",
          pincode: saved?.pincode || "",
        })
      })
      .catch((e) => {
        if (cancelled) return
        setShip({
          ...emptyShip,
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
        })
        toast.error(e instanceof Error ? e.message : "Could not load checkout")
      })
      .finally(finish)
    return () => {
      cancelled = true
      if (reveal) window.clearTimeout(reveal)
    }
  }, [ready, user?.id, user?.name, user?.email, user?.phone])

  useEffect(() => {
    const s = document.createElement("script")
    s.src = "https://checkout.razorpay.com/v1/checkout.js"
    s.async = true
    document.body.appendChild(s)
    return () => s.remove()
  }, [])

  const empty = lines.length === 0
  const patchShip = (key: keyof Ship) => (e: { target: { value: string } }) =>
    setShip((current) => ({ ...current, [key]: e.target.value }))
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)

  const lineId = (line: CartLine) => line.product.slug || line.productId

  const writeQty = useCallback(async (productId: string, quantity: number) => {
    try {
      await api("/api/cart", { method: "POST", body: JSON.stringify({ productId, quantity }) })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update quantity")
    }
  }, [])

  const flushQty = useCallback(async () => {
    const pending = { ...qtyPending.current }
    qtyPending.current = {}
    for (const timer of Object.values(qtyTimers.current)) window.clearTimeout(timer)
    qtyTimers.current = {}
    for (const job of Object.values(pending)) {
      await writeQty(job.productId, job.quantity)
    }
  }, [writeQty])

  const persistQty = (id: string, quantity: number) => {
    const current = draft ?? bag
    const line = current.find((item) => item.product.slug === id || item.productId === id || item.product.id === id)
    if (!line) return
    const productId = line.product.slug || line.productId
    const next =
      quantity <= 0
        ? current.filter((item) => item.product.slug !== id && item.productId !== id && item.product.id !== id)
        : current.map((item) =>
            item.product.slug === id || item.productId === id || item.product.id === id ? { ...item, quantity } : item,
          )
    setDraft(next)
    qtyPending.current[id] = { productId, quantity: Math.max(0, quantity) }
    window.clearTimeout(qtyTimers.current[id])
    qtyTimers.current[id] = window.setTimeout(() => {
      const job = qtyPending.current[id]
      delete qtyPending.current[id]
      if (!job) return
      void writeQty(job.productId, job.quantity)
    }, 280)
  }
  const discount = Math.min(quote?.totals.discount ?? 0, subtotal)
  const afterDiscount = Math.max(0, subtotal - discount)
  const settings = quote?.totals.settings
  const shippingFee = empty
    ? 0
    : settings
      ? afterDiscount >= settings.freeShippingOver
        ? 0
        : settings.shippingFee
      : (quote?.totals.shippingFee ?? 0)
  const tax = settings ? Math.round((afterDiscount * (settings.taxPercent ?? 0)) / 100) : (quote?.totals.tax ?? 0)
  const total = afterDiscount + shippingFee + tax

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (empty) return toast.error("Your bag is empty")
    if (quote?.paymentsEnabled === false) return toast.error("Checkout is temporarily paused")
    if ((quote?.minOrderAmount ?? 0) > 0 && total < (quote?.minOrderAmount ?? 0)) {
      return toast.error(`Minimum order is ${formatINR(quote!.minOrderAmount!)}`)
    }
    if (method === "razorpay" && !quote?.razorpayEnabled) {
      return toast.error("Online payment is not available yet. Please choose Cash on Delivery.")
    }
    if (method === "cod" && quote?.codEnabled === false) {
      return toast.error("Cash on delivery is not available")
    }
    const form = new FormData(e.currentTarget)
    setPending(true)
    try {
      await flushQty()
      const started = await api<{
        paymentMethod: "cod" | "razorpay"
        orderNumber: string
        amount: number
        razorpayOrderId?: string
        razorpayKey?: string
        name?: string
        email?: string
        phone?: string
      }>("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          paymentMethod: method,
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          saveAddress: true,
          couponCode: coupon || quote?.totals.couponCode,
          shipping: {
            name: form.get("name"),
            phone: form.get("phone"),
            line1: form.get("line1"),
            line2: form.get("line2"),
            city: form.get("city"),
            state: form.get("state"),
            pincode: form.get("pincode"),
            country: "India",
          },
        }),
      })

      if (started.paymentMethod === "cod") {
        toast.success("Order placed")
        await refresh()
        router.push(`/checkout/success?order=${started.orderNumber}&pay=cod`)
        return
      }

      if (!window.Razorpay) throw new Error("Razorpay checkout failed to load")
      const rzp = new window.Razorpay({
        key: started.razorpayKey,
        amount: started.amount * 100,
        currency: "INR",
        name: "NOOR E DERMA",
        description: `Order ${started.orderNumber}`,
        image: "/favicon.png",
        order_id: started.razorpayOrderId,
        prefill: { name: started.name, email: started.email, contact: started.phone },
        notes: { orderNumber: started.orderNumber },
        theme: { color: "#072654" },
        method: { netbanking: true, card: true, upi: true, wallet: true },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const done = await api<{ orderNumber: string }>("/api/payments/razorpay/verify", {
              method: "POST",
              body: JSON.stringify(response),
            })
            toast.success("Payment successful")
            await refresh()
            router.push(`/checkout/success?order=${done.orderNumber}&pay=razorpay`)
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not verify payment")
            router.push("/account/orders")
          }
        },
        modal: { ondismiss: () => toast("Payment window closed. Your order is held for 30 minutes.") },
      })
      rzp.open()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed")
    } finally {
      setPending(false)
    }
  }

  const applyCoupon = async () => {
    if (!coupon.trim()) return
    setCouponBusy(true)
    try {
      const data = await api<{ totals: Quote["totals"]; message: string }>("/api/coupons/apply", {
        method: "POST",
        body: JSON.stringify({ code: coupon }),
      })
      toast.success(data.message)
      setQuote((q) => (q ? { ...q, totals: data.totals } : q))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code")
    } finally {
      setCouponBusy(false)
    }
  }

  if (!ready) {
    return (
      <main className="dewy pt-28 pb-24">
        <PageBusy label="Loading checkout" />
      </main>
    )
  }

  return (
    <main className="dewy pt-24 pb-28 md:pt-28">
      <form onSubmit={onSubmit} className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-12 lg:px-8">
        <div className="space-y-8">
          <header>
            <p className="eyebrow">Checkout</p>
            <h1 className="mt-2 text-4xl md:text-5xl">Shipping</h1>
          </header>

          <div className="relative overflow-hidden rounded-[28px] bg-white/55 p-5 ring-1 ring-sage-100 md:p-6">
            <PrefillOverlay
              show={!prefilled}
              title="Prefilling your details"
              hint={
                !quote
                  ? "Checking your saved profile and address"
                  : quote.profile.addresses.length
                    ? "Using your saved profile and address"
                    : "Adding your profile details"
              }
            />
            <section>
              <h2 className="text-lg text-ink/80">Contact</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={label}>Full name</span>
                  <input name="name" value={ship.name} onChange={patchShip("name")} autoComplete="name" required disabled={!prefilled} className={field} />
                </label>
                <label className="block">
                  <span className={label}>Phone</span>
                  <input name="phone" value={ship.phone} onChange={patchShip("phone")} autoComplete="tel" required disabled={!prefilled} className={field} />
                </label>
                <label className="block sm:col-span-2">
                  <span className={label}>Email</span>
                  <input name="email" type="email" value={ship.email} onChange={patchShip("email")} autoComplete="email" required disabled={!prefilled} className={field} />
                </label>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-lg text-ink/80">Address</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className={label}>Address line 1</span>
                  <input name="line1" value={ship.line1} onChange={patchShip("line1")} autoComplete="address-line1" required disabled={!prefilled} className={field} />
                </label>
                <label className="block sm:col-span-2">
                  <span className={label}>Address line 2</span>
                  <input name="line2" value={ship.line2} onChange={patchShip("line2")} autoComplete="address-line2" disabled={!prefilled} className={field} />
                </label>
                <label className="block">
                  <span className={label}>City</span>
                  <input name="city" value={ship.city} onChange={patchShip("city")} autoComplete="address-level2" required disabled={!prefilled} className={field} />
                </label>
                <label className="block">
                  <span className={label}>State</span>
                  <input name="state" value={ship.state} onChange={patchShip("state")} autoComplete="address-level1" required disabled={!prefilled} className={field} />
                </label>
                <label className="block sm:col-span-2 sm:max-w-[12rem]">
                  <span className={label}>PIN code</span>
                  <input name="pincode" value={ship.pincode} onChange={patchShip("pincode")} autoComplete="postal-code" required disabled={!prefilled} className={field} />
                </label>
              </div>
            </section>
          </div>

          <div className="max-w-xl space-y-3">
            <PaymentPanel
              method={method}
              onMethod={setMethod}
              total={total}
              pending={pending}
              disabled={!prefilled || empty || quote?.paymentsEnabled === false}
              onlineEnabled={quote?.razorpayEnabled !== false && quote?.paymentsEnabled !== false}
              codEnabled={quote?.codEnabled !== false && quote?.paymentsEnabled !== false}
            />
            <LegalNote method={method} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className="rounded-3xl bg-white p-5 ring-1 ring-sage-100 md:p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl">Order summary</h2>
              <span className="text-[12px] text-ink/45">{lines.reduce((s, l) => s + l.quantity, 0)} items</span>
            </div>

            {empty ? (
              <div className="mt-8 flex flex-col items-center py-8 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-sage-50 text-ink/35">
                  <ShoppingBag size={18} />
                </span>
                <p className="mt-3 text-sm text-ink/60">Your bag is empty</p>
                <Link href="/shop" className="mt-3 text-[13px] text-gold-deep underline-offset-4 hover:underline">
                  Continue shopping
                </Link>
              </div>
            ) : (
              <ul className="mt-5 divide-y divide-sage-50">
                {lines.map((line) => {
                  const img = cover(line.product.images)
                  const key = lineId(line)
                  return (
                    <li key={key} className="flex gap-3 py-4 first:pt-0">
                      <span className="relative h-[4.5rem] w-14 shrink-0 overflow-hidden rounded-xl bg-peach">
                        {img?.src ? <img src={img.src} alt="" className="h-full w-full object-cover" /> : null}
                        <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] text-white">
                          {line.quantity}
                        </span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium leading-tight">{line.product.name}</p>
                        {line.product.netWeight ? <p className="mt-0.5 text-[12px] text-ink/45">{line.product.netWeight}</p> : null}
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <QuantityStepper value={line.quantity} onChange={(q) => void persistQty(key, q)} />
                          <button type="button" className="text-[11px] text-ink/40 hover:text-ink" onClick={() => void persistQty(key, 0)}>
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="shrink-0 text-sm font-medium">{formatINR(line.product.price * line.quantity)}</p>
                    </li>
                  )
                })}
              </ul>
            )}

            <div className="mt-2 flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="h-10 flex-1 rounded-full bg-ivory px-4 text-sm outline-none ring-1 ring-sage-100"
              />
              <button
                type="button"
                disabled={couponBusy || !coupon.trim()}
                onClick={() => void applyCoupon()}
                className="h-10 rounded-full px-4 text-[12px] font-medium ring-1 ring-sage-200 disabled:opacity-40"
              >
                {couponBusy ? "…" : "Apply"}
              </button>
            </div>

            <dl className="mt-5 space-y-2 border-t border-sage-50 pt-4 text-sm">
              <div className="flex justify-between text-ink/60">
                <dt>Subtotal</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
              {discount > 0 ? (
                <div className="flex justify-between text-sage-700">
                  <dt>Discount</dt>
                  <dd>−{formatINR(discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between text-ink/60">
                <dt>Shipping</dt>
                <dd>{shippingFee === 0 ? "Free" : formatINR(shippingFee)}</dd>
              </div>
              {quote?.estimatedDelivery ? (
                <p className="text-[12px] text-ink/45">{quote.estimatedDelivery}</p>
              ) : null}
              <div className="flex justify-between border-t border-sage-50 pt-3 text-base font-medium">
                <dt>Total</dt>
                <dd>{formatINR(total)}</dd>
              </div>
            </dl>

          </div>
        </aside>
      </form>
    </main>
  )
}

function LegalNote({ method }: { method: "cod" | "razorpay" }) {
  return (
    <div className="space-y-2 text-[11px] leading-relaxed text-ink/45">
      <p>
        By placing this order you agree to our{" "}
        <Link href="/policies/terms" className="underline underline-offset-2 hover:text-ink">
          Terms
        </Link>
        ,{" "}
        <Link href="/policies/shipping" className="underline underline-offset-2 hover:text-ink">
          Shipping
        </Link>{" "}
        and{" "}
        <Link href="/policies/refund" className="underline underline-offset-2 hover:text-ink">
          Refund policy
        </Link>
        . We will email order confirmation and tracking after the order is placed.
      </p>
      {method === "razorpay" ? (
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <RazorpaySecure />
          <span>
            Payments are processed by Razorpay, an RBI-authorised payment aggregator. Card and UPI details never touch NOOR E DERMA servers.
          </span>
        </p>
      ) : (
        <p className="inline-flex items-center gap-1.5">
          <Lock size={11} /> <ShieldCheck size={11} /> Pay cash to the courier. Keep the exact amount ready.
        </p>
      )}
    </div>
  )
}
