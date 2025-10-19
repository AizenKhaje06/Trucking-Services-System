import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/owner-dashboard", "/employee-portal"]
const publicRoutes = ["/"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.includes(pathname)

  if (!isProtectedRoute && !isPublicRoute) {
    return NextResponse.next()
  }

  // Get session from cookies
  const sessionCookie = request.cookies.get("truckflow_session")
  const hasSession = !!sessionCookie?.value

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If accessing login page with active session, redirect to dashboard
  if (isPublicRoute && hasSession && pathname === "/") {
    try {
      const session = JSON.parse(sessionCookie.value)
      const redirectUrl = session.role === "Owner" ? "/owner-dashboard" : "/employee-portal"
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    } catch {
      // If session parsing fails, allow access to login
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
