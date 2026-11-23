import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto"
import { env } from "@/lib/env"

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("hex")
}

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

export function hmac(value: string) {
  const secret = env.sessionSecret || "dev-only-do-not-use-in-production"
  return createHmac("sha256", secret).update(value).digest("hex")
}

export function hashToken(token: string) {
  return hmac(token)
}

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export function orderNumber() {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`
  const suffix = randomBytes(3).toString("hex").toUpperCase()
  return `ND-${ymd}-${suffix}`
}
