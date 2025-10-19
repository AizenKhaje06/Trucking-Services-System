import { type NextRequest, NextResponse } from "next/server"
import { readSheetData } from "@/lib/google-sheets"
import { parseTransactionFromSheet, filterTransactions, calculateTransactionSummary } from "@/lib/transactions"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, filters } = await request.json()

    if (!spreadsheetId) {
      return NextResponse.json({ message: "Missing spreadsheetId" }, { status: 400 })
    }

    const data = await readSheetData(spreadsheetId, "Transactions!A:K")
    const transactions = data.map(parseTransactionFromSheet)
    const filtered = filterTransactions(transactions, filters || {})
    const summary = calculateTransactionSummary(filtered)

    return NextResponse.json({ summary, transactionCount: filtered.length }, { status: 200 })
  } catch (error) {
    console.error("Error calculating summary:", error)
    return NextResponse.json({ message: "Failed to calculate summary" }, { status: 500 })
  }
}
