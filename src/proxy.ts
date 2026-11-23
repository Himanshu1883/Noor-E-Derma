import { NextResponse, type NextRequest } from "next/server"

const SESSION = "nd_sid"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sid = request.cookies.get(SESSION)?.value

  if (pathname.startsWith("/admin") && !sid) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.search = ""
    url.searchParams.set("auth", "login")
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }
  if (pathname.startsWith("/account") && !sid) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.search = ""
    url.searchParams.set("auth", "login")
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }
  if (pathname.startsWith("/checkout") && !sid) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.search = ""
    url.searchParams.set("auth", "login")
    url.searchParams.set("next", "/checkout")
    return NextResponse.redirect(url)
  }

  const res = NextResponse.next()
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  return res
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/:path*", "/((?!_next/static|_next/image|favicon.png|favicon.ico|icon).*)"],
}
