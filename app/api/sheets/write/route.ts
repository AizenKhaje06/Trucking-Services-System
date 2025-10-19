import { type NextRequest, NextResponse } from "next/server"
import { writeSheetData } from "@/lib/google-sheets"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, range, values } = await request.json()

    if (!spreadsheetId || !range || !values) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 })
    }

    await writeSheetData(spreadsheetId, range, values)
    return NextResponse.json({ message: "Data written successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error writing to sheet:", error)
    return NextResponse.json({ message: "Failed to write sheet data" }, { status: 500 })
  }
}
