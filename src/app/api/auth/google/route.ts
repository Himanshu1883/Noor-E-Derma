import { NextResponse } from "next/server"
import { googleAuthUrl } from "@/lib/auth/google"

export async function GET(request: Request) {
  try {
    const next = new URL(request.url).searchParams.get("next") ?? ""
    const url = await googleAuthUrl(next)
    return NextResponse.redirect(url)
  } catch (err) {
    const origin = new URL(request.url).origin
    const message = err instanceof Error ? err.message : "Google sign-in failed"
    return NextResponse.redirect(`${origin}/?auth=login&error=${encodeURIComponent(message)}`)
  }
}
