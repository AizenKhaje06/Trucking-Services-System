import { type NextRequest, NextResponse } from "next/server"
import { updateSessionActivity } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    await updateSessionActivity()
    return NextResponse.json({ message: "Activity updated" }, { status: 200 })
  } catch (error) {
    console.error("Activity update error:", error)
    return NextResponse.json({ message: "Failed to update activity" }, { status: 500 })
  }
}
