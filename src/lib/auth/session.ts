import { cookies } from "next/headers"
import { ApiError } from "@/lib/api"
import { hashToken, randomToken } from "@/lib/crypto"
import { connectDb } from "@/lib/db"
import { env } from "@/lib/env"
import { Session } from "@/models/Session"
import { User, type UserDoc } from "@/models/User"
import type { PublicUser } from "@/lib/auth/types"

export const SESSION_COOKIE = "nd_sid"
export const GUEST_COOKIE = "nd_gid"
const SESSION_DAYS = 14
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000
const sessionUserCache = new Map<string, { t: number; user: UserDoc }>()
const SESSION_USER_TTL_MS = 5000

export type { PublicUser }

export function toPublicUser(user: UserDoc): PublicUser {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    role: user.role,
    emailVerified: Boolean(user.emailVerifiedAt),
    addresses: (user.addresses ?? []).map((a) => ({
      _id: String((a as { _id?: { toString(): string } })._id ?? ""),
      label: a.label,
      name: a.name,
      phone: a.phone,
      line1: a.line1,
      line2: a.line2,
      city: a.city,
      state: a.state,
      pincode: a.pincode,
      country: a.country,
      isDefault: a.isDefault,
    })),
  }
}

export function cookieOptions() {
  return {
    httpOnly: true as const,
    secure: env.isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MS / 1000,
  }
}

export async function createSession(userId: string, meta?: { ip?: string; userAgent?: string }) {
  await connectDb()
  const token = randomToken(32)
  await Session.create({
    tokenHash: hashToken(token),
    userId,
    expiresAt: new Date(Date.now() + SESSION_MS),
    ip: meta?.ip ?? "",
    userAgent: (meta?.userAgent ?? "").slice(0, 280),
  })
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, cookieOptions())
  return token
}

export async function destroySession() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (token) {
    const tokenHash = hashToken(token)
    sessionUserCache.delete(tokenHash)
    await connectDb()
    await Session.deleteOne({ tokenHash })
  }
  jar.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 })
}

export async function destroyAllSessions(userId: string) {
  await connectDb()
  await Session.deleteMany({ userId })
}

export async function getSessionLite(): Promise<{ id: string; role: string } | null> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null
  const tokenHash = hashToken(token)
  const cached = sessionUserCache.get(tokenHash)
  if (cached && Date.now() - cached.t < SESSION_USER_TTL_MS) {
    return { id: String(cached.user._id), role: cached.user.role }
  }
  await connectDb()
  const session = await Session.findOne({ tokenHash, expiresAt: { $gt: new Date() } }).select("userId").lean()
  if (!session) return null
  const user = await User.findById(session.userId).select("role status").lean()
  if (!user || user.status !== "active") return null
  return { id: String(user._id), role: user.role }
}

export async function getSessionUser(): Promise<UserDoc | null> {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null
  const tokenHash = hashToken(token)
  const cached = sessionUserCache.get(tokenHash)
  if (cached && Date.now() - cached.t < SESSION_USER_TTL_MS) return cached.user
  await connectDb()
  const session = await Session.findOne({ tokenHash, expiresAt: { $gt: new Date() } })
    .select("userId expiresAt")
    .lean()
  if (!session) return null
  const user = await User.findById(session.userId)
  if (!user || user.status !== "active") {
    sessionUserCache.delete(tokenHash)
    return null
  }
  const remaining = session.expiresAt.getTime() - Date.now()
  if (remaining < SESSION_MS / 2) {
    await Session.updateOne({ _id: session._id }, { $set: { expiresAt: new Date(Date.now() + SESSION_MS) } })
    jar.set(SESSION_COOKIE, token, cookieOptions())
  }
  sessionUserCache.set(tokenHash, { t: Date.now(), user })
  return user
}

export async function requireUser() {
  const user = await getSessionUser()
  if (!user) throw new ApiError(401, "Please sign in to continue")
  return user
}

export async function requireAdmin() {
  const user = await requireUser()
  if (user.role !== "admin") throw new ApiError(403, "Admin access required")
  return user
}

export async function getOrCreateGuestId() {
  const jar = await cookies()
  const existing = jar.get(GUEST_COOKIE)?.value
  if (existing && /^[a-f0-9]{32,64}$/.test(existing)) return existing
  const id = randomToken(16)
  jar.set(GUEST_COOKIE, id, { ...cookieOptions(), httpOnly: true, maxAge: 60 * 60 * 24 * 30 })
  return id
}
