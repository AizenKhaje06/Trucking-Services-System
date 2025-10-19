import { type NextRequest, NextResponse } from "next/server"
import { readSheetData } from "@/lib/google-sheets"
import { parseTransactionFromSheet } from "@/lib/transactions"
import { parseExpenseFromSheet } from "@/lib/expenses"
import { generateEODReport } from "@/lib/eod-summary"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, date, employees } = await request.json()

    if (!spreadsheetId || !date) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 })
    }

    const [transactionsData, expensesData] = await Promise.all([
      readSheetData(spreadsheetId, "Transactions!A:K"),
      readSheetData(spreadsheetId, "Expenses!A:F"),
    ])

    const transactions = transactionsData.map(parseTransactionFromSheet)
    const expenses = expensesData.map(parseExpenseFromSheet)

    const report = generateEODReport(date, transactions, expenses, employees || [])

    return NextResponse.json({ success: true, report }, { status: 200 })
  } catch (error) {
    console.error("Error generating EOD summary:", error)
    return NextResponse.json({ message: "Failed to generate EOD summary" }, { status: 500 })
  }
}
