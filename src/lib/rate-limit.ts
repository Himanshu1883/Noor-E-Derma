import { ApiError } from "@/lib/api"

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

function prune(now: number) {
  if (buckets.size < 2000) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key)
  }
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  prune(now)
  const current = buckets.get(key)
  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return
  }
  current.count += 1
  if (current.count > limit) {
    throw new ApiError(429, "Too many attempts. Please wait and try again.", "rate_limited")
  }
}
