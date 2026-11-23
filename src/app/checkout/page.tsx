"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { GoldButton } from "@/components/GoldButton"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { api } from "@/lib/client"
import { formatINR } from "@/lib/format"
import type { PublicAddress } from "@/lib/auth/types"

type Quote = {
  cart: { lines: { productId: string; quantity: number; product: { name: string; price: number; images: { src: string }[] } }[]; subtotal: number }
  totals: { subtotal: number; discount: number; shippingFee: number; tax: number; total: number; couponCode: string }
  profile: { name: string; email: string; phone: string; addresses: PublicAddress[] }
}

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void }
  }
}

export default function CheckoutPage() {
  const { user } = useAuth()
  const { refresh } = useCart()
  const router = useRouter()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    api<Quote>("/api/checkout")
      .then(setQuote)
      .catch((e) => toast.error(e.message))
    const s = document.createElement("script")
    s.src = "https://checkout.razorpay.com/v1/checkout.js"
    document.body.appendChild(s)
    return () => s.remove()
  }, [])

  const addr = quote?.profile.addresses.find((a) => a.isDefault) ?? quote?.profile.addresses[0]

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!quote?.cart.lines.length) return toast.error("Your bag is empty")
    const form = new FormData(e.currentTarget)
    setPending(true)
    try {
      const started = await api<{
        orderId: string
        orderNumber: string
        amount: number
        razorpayOrderId: string
        razorpayKey: string
        name: string
        email: string
        phone: string
      }>("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          saveAddress: true,
          couponCode: form.get("coupon") || quote.totals.couponCode,
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
      if (!window.Razorpay) throw new Error("Payment window failed to load")
      const rzp = new window.Razorpay({
        key: started.razorpayKey,
        amount: started.amount * 100,
        currency: "INR",
        name: "NOOR E DERMA",
        order_id: started.razorpayOrderId,
        prefill: { name: started.name, email: started.email, contact: started.phone },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const done = await api<{ orderNumber: string }>("/api/payments/razorpay/verify", {
              method: "POST",
              body: JSON.stringify(response),
            })
            toast.success("Payment successful")
            await refresh()
            router.push(`/checkout/success?order=${done.orderNumber}`)
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not verify payment")
            router.push(`/account/orders`)
          }
        },
        modal: {
          ondismiss: () => toast("Payment window closed. Your order is held for 30 minutes."),
        },
      })
      rzp.open()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed")
    } finally {
      setPending(false)
    }
  }

  const applyCoupon = async (code: string) => {
    try {
      const data = await api<{ totals: Quote["totals"]; message: string }>("/api/coupons/apply", {
        method: "POST",
        body: JSON.stringify({ code }),
      })
      toast.success(data.message)
      setQuote((q) => (q ? { ...q, totals: data.totals } : q))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid code")
    }
  }

  return (
    <main className="dewy pt-28 pb-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-[1fr_340px] md:px-8">
        <form onSubmit={onSubmit} className="rounded-[28px] bg-ivory p-6 ring-1 ring-sage-100 md:p-8">
          <p className="eyebrow">Checkout</p>
          <h1 className="mt-2 text-4xl">Delivery</h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <input name="name" defaultValue={user?.name ?? addr?.name} required placeholder="Full name" className="rounded-full bg-white px-4 py-3 text-sm ring-1 ring-sage-100" />
            <input name="phone" defaultValue={user?.phone ?? addr?.phone} required placeholder="Phone" className="rounded-full bg-white px-4 py-3 text-sm ring-1 ring-sage-100" />
            <input name="email" type="email" defaultValue={user?.email} required placeholder="Email" className="sm:col-span-2 rounded-full bg-white px-4 py-3 text-sm ring-1 ring-sage-100" />
            <input name="line1" defaultValue={addr?.line1} required placeholder="Address line 1" className="sm:col-span-2 rounded-full bg-white px-4 py-3 text-sm ring-1 ring-sage-100" />
            <input name="line2" defaultValue={addr?.line2} placeholder="Address line 2" className="sm:col-span-2 rounded-full bg-white px-4 py-3 text-sm ring-1 ring-sage-100" />
            <input name="city" defaultValue={addr?.city} required placeholder="City" className="rounded-full bg-white px-4 py-3 text-sm ring-1 ring-sage-100" />
            <input name="state" defaultValue={addr?.state} required placeholder="State" className="rounded-full bg-white px-4 py-3 text-sm ring-1 ring-sage-100" />
            <input name="pincode" defaultValue={addr?.pincode} required placeholder="PIN code" className="rounded-full bg-white px-4 py-3 text-sm ring-1 ring-sage-100" />
            <div className="sm:col-span-2 flex gap-2">
              <input name="coupon" placeholder="Coupon code" className="flex-1 rounded-full bg-white px-4 py-3 text-sm ring-1 ring-sage-100" />
              <button
                type="button"
                className="rounded-full px-4 text-sm ring-1 ring-sage-200"
                onClick={(ev) => {
                  const input = (ev.currentTarget.form?.elements.namedItem("coupon") as HTMLInputElement | null)?.value
                  if (input) void applyCoupon(input)
                }}
              >
                Apply
              </button>
            </div>
          </div>
          <GoldButton type="submit" className="mt-6 w-full">
            {pending ? "Opening payment…" : "Pay securely"}
          </GoldButton>
        </form>
        <aside className="h-fit rounded-[28px] bg-ivory p-6 ring-1 ring-sage-100">
          <h2 className="text-2xl">Bag</h2>
          <ul className="mt-4 space-y-3">
            {quote?.cart.lines.map((line) => (
              <li key={line.productId} className="flex justify-between gap-3 text-sm">
                <span>
                  {line.product.name} × {line.quantity}
                </span>
                <span>{formatINR(line.product.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-sage-100 pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatINR(quote?.totals.subtotal ?? 0)}</dd></div>
            <div className="flex justify-between"><dt>Discount</dt><dd>-{formatINR(quote?.totals.discount ?? 0)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{formatINR(quote?.totals.shippingFee ?? 0)}</dd></div>
            <div className="flex justify-between text-lg font-medium"><dt>Total</dt><dd>{formatINR(quote?.totals.total ?? 0)}</dd></div>
          </dl>
        </aside>
      </div>
    </main>
  )
}
