import { type NextRequest, NextResponse } from "next/server"
import { readSheetData } from "@/lib/google-sheets"
import { parseTransactionFromSheet } from "@/lib/transactions"
import { parseExpenseFromSheet } from "@/lib/expenses"
import { generateMonthlyReports, getLastNMonths } from "@/lib/monthly-report"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, months = 12 } = await request.json()

    if (!spreadsheetId) {
      return NextResponse.json({ message: "Missing spreadsheetId" }, { status: 400 })
    }

    const [transactionsData, expensesData] = await Promise.all([
      readSheetData(spreadsheetId, "Transactions!A:K"),
      readSheetData(spreadsheetId, "Expenses!A:F"),
    ])

    const transactions = transactionsData.map(parseTransactionFromSheet)
    const expenses = expensesData.map(parseExpenseFromSheet)

    const monthsList = getLastNMonths(months)
    const reports = generateMonthlyReports(monthsList, transactions, expenses)

    return NextResponse.json({ success: true, reports, count: reports.length }, { status: 200 })
  } catch (error) {
    console.error("Error generating monthly reports:", error)
    return NextResponse.json({ message: "Failed to generate monthly reports" }, { status: 500 })
  }
}
