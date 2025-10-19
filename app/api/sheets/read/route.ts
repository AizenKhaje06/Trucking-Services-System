import { type NextRequest, NextResponse } from "next/server"
import { readSheetData } from "@/lib/google-sheets"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, range } = await request.json()

    if (!spreadsheetId || !range) {
      return NextResponse.json({ message: "Missing spreadsheetId or range" }, { status: 400 })
    }

    const data = await readSheetData(spreadsheetId, range)
    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error("Error reading sheet:", error)
    return NextResponse.json({ message: "Failed to read sheet data" }, { status: 500 })
  }
}
