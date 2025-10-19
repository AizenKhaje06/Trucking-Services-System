import { type NextRequest, NextResponse } from "next/server"
import { destroySession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Clear the session cookie and redirect to login
    await destroySession()
    return NextResponse.redirect(new URL("/", request.url))
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "Failed to logout" }, { status: 500 })
  }
}
