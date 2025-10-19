import { type NextRequest, NextResponse } from "next/server"
import { destroySession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Clear the session cookie and redirect to login
    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
    response.cookies.set("truckflow_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "Failed to logout" }, { status: 500 })
  }
}
