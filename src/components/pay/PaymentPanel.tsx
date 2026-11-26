"use client"

import { CreditCard, Lock, Package, ShieldCheck, Zap } from "lucide-react"
import type { ReactNode } from "react"
import { GoldButton } from "@/components/GoldButton"
import { PaymentMethodTiles } from "@/components/pay/PayMarks"
import { cn } from "@/lib/cn"
import { formatINR } from "@/lib/format"

type Method = "razorpay" | "cod"

export function PaymentPanel({
  method,
  onMethod,
  total,
  pending,
  disabled,
  onlineEnabled = true,
  codEnabled = true,
}: {
  method: Method
  onMethod: (method: Method) => void
  total: number
  pending: boolean
  disabled: boolean
  onlineEnabled?: boolean
  codEnabled?: boolean
}) {
  const online = method === "razorpay"

  return (
    <section className="rounded-[1.75rem] bg-white p-5 ring-1 ring-sage-100 sm:p-6">
      <h2 className="text-2xl text-ink">Payment</h2>
      <p className="mt-1 text-[13px] text-ink/50">Choose a payment method to complete your order</p>

      <div className="mt-5 space-y-3">
        {onlineEnabled ? (
        <button
          type="button"
          onClick={() => onMethod("razorpay")}
          className={cn(
            "w-full rounded-2xl px-4 py-3.5 text-left transition",
            online ? "bg-sage-50 ring-1 ring-gold-deep/45" : "bg-white ring-1 ring-sage-100 hover:ring-sage-200",
          )}
        >
          <span className="flex items-start gap-3">
            <Radio on={online} />
            <CreditCard size={18} className="mt-0.5 shrink-0 text-ink/70" />
            <span className="min-w-0 flex-1">
              <span className="flex items-start justify-between gap-2">
                <span>
                  <span className="block text-[14px] font-medium text-ink">Pay Online</span>
                  <span className="mt-0.5 block text-[12px] text-ink/50">
                    Pay securely using UPI, cards, netbanking & wallets
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-sage-800 ring-1 ring-sage-100">
                  Recommended
                </span>
              </span>
              <span className="mt-3 block">
                <PaymentMethodTiles />
              </span>
            </span>
          </span>
        </button>
        ) : null}

        {codEnabled ? (
        <button
          type="button"
          onClick={() => onMethod("cod")}
          className={cn(
            "flex w-full items-start gap-3 rounded-2xl px-4 py-3.5 text-left transition",
            method === "cod" ? "bg-sage-50 ring-1 ring-gold-deep/45" : "bg-white ring-1 ring-sage-100 hover:ring-sage-200",
          )}
        >
          <Radio on={method === "cod"} />
          <Package size={18} className="mt-0.5 shrink-0 text-ink/70" />
          <span>
            <span className="block text-[14px] font-medium text-ink">Cash on Delivery</span>
            <span className="mt-0.5 block text-[12px] text-ink/50">Pay in cash when your order is delivered</span>
          </span>
        </button>
        ) : null}
        {!onlineEnabled && !codEnabled ? (
          <p className="rounded-2xl bg-ivory px-4 py-3 text-sm text-ink/60">Checkout is paused. No payment methods are available.</p>
        ) : null}
      </div>

      <div className="mt-5 flex justify-center">
        <GoldButton type="submit" loading={pending} disabled={disabled}>
          {pending ? "Placing order" : online ? `Pay securely · ${formatINR(total)}` : `Place order · ${formatINR(total)}`}
        </GoldButton>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-sage-50 pt-4">
        <TrustItem icon={<ShieldCheck size={15} />} title="Secure Payments" hint="Powered by Razorpay" />
        <TrustItem icon={<Zap size={15} />} title="Instant Confirmation" hint="Get order details instantly" />
        <TrustItem icon={<Lock size={15} />} title="100% Safe" hint="Your payment is encrypted" />
      </div>
    </section>
  )
}

function Radio({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full ring-1",
        on ? "ring-gold-deep" : "ring-sage-300",
      )}
    >
      {on ? <span className="h-2 w-2 rounded-full bg-gold-deep" /> : null}
    </span>
  )
}

function TrustItem({ icon, title, hint }: { icon: ReactNode; title: string; hint: ReactNode }) {
  return (
    <span className="flex items-start gap-1.5 text-left">
      <span className="mt-0.5 text-gold-deep">{icon}</span>
      <span>
        <span className="block text-[11px] font-medium leading-tight text-ink">{title}</span>
        <span className="mt-0.5 block text-[10px] leading-snug text-ink/45">{hint}</span>
      </span>
    </span>
  )
}
