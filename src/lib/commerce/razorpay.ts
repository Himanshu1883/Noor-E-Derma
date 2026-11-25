import crypto from "node:crypto"
import Razorpay from "razorpay"
import { ApiError } from "@/lib/api"
import { env } from "@/lib/env"
import { logger } from "@/lib/logger"

const PLACEHOLDER = /476828979824/

export function razorpayEnabled() {
  const id = env.razorpayKeyId
  const secret = env.razorpayKeySecret
  if (!id || !secret) return false
  if (PLACEHOLDER.test(id) || PLACEHOLDER.test(secret)) return false
  return /^rzp_(test|live)_[A-Za-z0-9]{8,}$/.test(id)
}

export function razorpayClient() {
  if (!razorpayEnabled()) {
    throw new ApiError(
      503,
      "Razorpay test keys are not set. In Razorpay Dashboard turn Test Mode ON, copy Key ID (rzp_test_…) and Key Secret into .env.local, then restart the server.",
    )
  }
  return new Razorpay({ key_id: env.razorpayKeyId, key_secret: env.razorpayKeySecret })
}

function razorpayMessage(err: unknown) {
  if (!err) return ""
  if (typeof err === "string") return err
  if (err instanceof Error && err.message && err.message !== "[object Object]") return err.message
  const raw = err as { error?: { description?: string; reason?: string; code?: string }; description?: string; message?: string; statusCode?: number }
  const nested = raw.error
  const text = nested?.description || nested?.reason || raw.description || (typeof raw.message === "string" ? raw.message : "")
  if (text && text !== "[object Object]") return text
  try {
    return JSON.stringify(err)
  } catch {
    return ""
  }
}

export async function createRazorpayOrder(input: {
  amountInr: number
  receipt: string
  notes: Record<string, string>
}) {
  const paise = Math.round(input.amountInr * 100)
  if (!Number.isFinite(paise) || paise < 100) {
    throw new ApiError(400, "Order total is too small to pay online.")
  }
  try {
    return await razorpayClient().orders.create({
      amount: paise,
      currency: "INR",
      receipt: input.receipt.slice(0, 40),
      notes: input.notes,
    })
  } catch (err) {
    const detail = razorpayMessage(err)
    logger.error("razorpay_order_create", { detail, err: typeof err === "object" ? err : String(err) })
    if (/auth/i.test(detail) || /invalid.*key/i.test(detail) || /401/.test(detail)) {
      throw new ApiError(
        502,
        "Razorpay authentication failed (401). This Key ID and Key Secret are not a matching pair. In Dashboard keep Test Mode ON → API Keys → Regenerate Key Secret, then paste the Key ID and the new secret together into .env.local (no quotes). Restart npm run dev.",
      )
    }
    throw new ApiError(502, detail || "Razorpay could not start this payment. Check test API keys and try again.")
  }
}

export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  const body = `${orderId}|${paymentId}`
  const expected = crypto.createHmac("sha256", env.razorpayKeySecret).update(body).digest("hex")
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = env.razorpayWebhookSecret || env.razorpayKeySecret
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
