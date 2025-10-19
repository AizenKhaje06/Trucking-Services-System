import { type NextRequest, NextResponse } from "next/server"
import { readSheetData } from "@/lib/google-sheets"
import { parseExpenseFromSheet, filterExpenses } from "@/lib/expenses"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, filters } = await request.json()

    if (!spreadsheetId) {
      return NextResponse.json({ message: "Missing spreadsheetId" }, { status: 400 })
    }

    const data = await readSheetData(spreadsheetId, "Expenses!A:F")
    const expenses = data.map(parseExpenseFromSheet)
    const filtered = filterExpenses(expenses, filters || {})

    return NextResponse.json({ expenses: filtered, count: filtered.length }, { status: 200 })
  } catch (error) {
    console.error("Error listing expenses:", error)
    return NextResponse.json({ message: "Failed to list expenses" }, { status: 500 })
  }
}
