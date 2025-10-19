import { type NextRequest, NextResponse } from "next/server"
import { generateBackup, generateExcelContent } from "@/lib/backup-export"
import { getSession, validateSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !validateSession(session) || session.role !== "Owner") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID
    if (!spreadsheetId) {
      return NextResponse.json({ message: "Google Sheets configuration missing" }, { status: 500 })
    }

    const backup = await generateBackup(spreadsheetId)
    const excelContent = generateExcelContent(backup)

    return NextResponse.json(
      {
        success: true,
        backup,
        excelContent,
        timestamp: backup.timestamp,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Backup export error:", error)
    return NextResponse.json({ message: "Failed to generate backup" }, { status: 500 })
  }
}
