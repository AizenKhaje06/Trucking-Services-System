import { type NextRequest, NextResponse } from "next/server"
import { readSheetData } from "@/lib/google-sheets"
import { parseTransactionFromSheet } from "@/lib/transactions"
import { parseExpenseFromSheet } from "@/lib/expenses"
import { generateMonthlyReport } from "@/lib/monthly-report"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, month, year } = await request.json()

    if (!spreadsheetId || !month || !year) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 })
    }

    const [transactionsData, expensesData] = await Promise.all([
      readSheetData(spreadsheetId, "Transactions!A:K"),
      readSheetData(spreadsheetId, "Expenses!A:F"),
    ])

    const transactions = transactionsData.map(parseTransactionFromSheet)
    const expenses = expensesData.map(parseExpenseFromSheet)

    const report = generateMonthlyReport(month, year, transactions, expenses)

    return NextResponse.json({ success: true, report }, { status: 200 })
  } catch (error) {
    console.error("Error generating monthly report:", error)
    return NextResponse.json({ message: "Failed to generate monthly report" }, { status: 500 })
  }
}
