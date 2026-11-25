import { NextResponse } from "next/server"
import { clientIp } from "@/lib/api"
import { consumeGoogleNext, exchangeGoogleCode } from "@/lib/auth/google"
import { createSession } from "@/lib/auth/session"
import { mergeGuestCart } from "@/lib/commerce/cart"
import { connectDb } from "@/lib/db"
import { env } from "@/lib/env"
import { User } from "@/models/User"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const errRedirect = (msg: string) =>
    NextResponse.redirect(`${env.appUrl}/?auth=login&error=${encodeURIComponent(msg)}`)
  try {
    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")
    if (!code || !state) return errRedirect("Google sign-in was cancelled")
    const profile = await exchangeGoogleCode(code, state)
    await connectDb()
    let user = await User.findOne({ $or: [{ googleId: profile.id }, { email: profile.email!.toLowerCase() }] })
    if (user && user.status !== "active") return errRedirect("This account has been disabled")
    if (!user) {
      user = await User.create({
        name: profile.name || profile.email!.split("@")[0],
        email: profile.email!.toLowerCase(),
        googleId: profile.id,
        role: "customer",
        status: "active",
        emailVerifiedAt: profile.verified_email ? new Date() : undefined,
      })
    } else {
      user.googleId = user.googleId || profile.id
      if (profile.verified_email && !user.emailVerifiedAt) user.emailVerifiedAt = new Date()
      user.lastLoginAt = new Date()
      await user.save()
    }
    await createSession(String(user._id), { ip: clientIp(request), userAgent: request.headers.get("user-agent") ?? "" })
    await mergeGuestCart(String(user._id))
    const wanted = await consumeGoogleNext()
    const next = user.role === "admin" ? (wanted.startsWith("/admin") ? wanted : "/admin") : wanted || "/"
    return NextResponse.redirect(`${env.appUrl}${next}`)
  } catch {
    return errRedirect("Google sign-in failed")
  }
}
