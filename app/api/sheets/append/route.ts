import { type NextRequest, NextResponse } from "next/server"
import { appendSheetData } from "@/lib/google-sheets"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, range, values } = await request.json()

    if (!spreadsheetId || !range || !values) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 })
    }

    await appendSheetData(spreadsheetId, range, values)
    return NextResponse.json({ message: "Data appended successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error appending to sheet:", error)
    return NextResponse.json({ message: "Failed to append sheet data" }, { status: 500 })
  }
}
