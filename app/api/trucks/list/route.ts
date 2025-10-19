import { type NextRequest, NextResponse } from "next/server"
import { readSheetData } from "@/lib/google-sheets"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId } = await request.json()

    if (!spreadsheetId) {
      return NextResponse.json({ message: "Missing spreadsheetId" }, { status: 400 })
    }

    const data = await readSheetData(spreadsheetId, "Trucks!A:F")
    return NextResponse.json({ trucks: data }, { status: 200 })
  } catch (error) {
    console.error("Error listing trucks:", error)
    return NextResponse.json({ message: "Failed to list trucks" }, { status: 500 })
  }
}
