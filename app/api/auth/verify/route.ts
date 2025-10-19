import { type NextRequest, NextResponse } from "next/server"
import { getSession, validateSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !validateSession(session)) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true, session }, { status: 200 })
  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
