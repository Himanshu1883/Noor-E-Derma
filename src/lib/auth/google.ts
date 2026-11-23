import { cookies } from "next/headers"
import { ApiError } from "@/lib/api"
import { randomToken } from "@/lib/crypto"
import { env } from "@/lib/env"

const STATE_COOKIE = "nd_oauth_state"

export function googleEnabled() {
  return Boolean(env.googleClientId && env.googleClientSecret)
}

export function googleRedirectUri() {
  return `${env.appUrl}/api/auth/google/callback`
}

export async function googleAuthUrl() {
  if (!googleEnabled()) throw new ApiError(503, "Google login is not configured")
  const state = randomToken(16)
  const jar = await cookies()
  jar.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  })
  const params = new URLSearchParams({
    client_id: env.googleClientId,
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export async function exchangeGoogleCode(code: string, state: string) {
  const jar = await cookies()
  const expected = jar.get(STATE_COOKIE)?.value
  jar.set(STATE_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 })
  if (!expected || expected !== state) throw new ApiError(400, "Invalid Google sign-in state")
  const body = new URLSearchParams({
    code,
    client_id: env.googleClientId,
    client_secret: env.googleClientSecret,
    redirect_uri: googleRedirectUri(),
    grant_type: "authorization_code",
  })
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })
  if (!tokenRes.ok) throw new ApiError(400, "Google sign-in failed")
  const tokens = (await tokenRes.json()) as { access_token?: string }
  if (!tokens.access_token) throw new ApiError(400, "Google sign-in failed")
  const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  if (!profileRes.ok) throw new ApiError(400, "Could not read Google profile")
  const profile = (await profileRes.json()) as {
    id: string
    email?: string
    name?: string
    verified_email?: boolean
  }
  if (!profile.email) throw new ApiError(400, "Google account has no email")
  return profile
}
