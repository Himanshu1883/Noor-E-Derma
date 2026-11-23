import crypto from "node:crypto"
import Razorpay from "razorpay"
import { ApiError } from "@/lib/api"
import { env } from "@/lib/env"

export function razorpayEnabled() {
  return Boolean(env.razorpayKeyId && env.razorpayKeySecret)
}

export function razorpayClient() {
  if (!razorpayEnabled()) throw new ApiError(503, "Payments are not configured yet")
  return new Razorpay({ key_id: env.razorpayKeyId, key_secret: env.razorpayKeySecret })
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
