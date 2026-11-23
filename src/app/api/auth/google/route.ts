import { NextResponse } from "next/server"
import { errorResponse } from "@/lib/api"
import { googleAuthUrl } from "@/lib/auth/google"

export async function GET() {
  try {
    const url = await googleAuthUrl()
    return NextResponse.redirect(url)
  } catch (err) {
    return errorResponse(err)
  }
}
