import { type NextRequest, NextResponse } from "next/server"
import { getSession, validateSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !validateSession(session)) {
      return NextResponse.json({ session: null }, { status: 200 })
    }

    return NextResponse.json({ session }, { status: 200 })
  } catch (error) {
    console.error("Session retrieval error:", error)
    return NextResponse.json({ session: null }, { status: 200 })
  }
}
