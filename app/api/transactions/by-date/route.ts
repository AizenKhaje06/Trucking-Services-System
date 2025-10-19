import { type NextRequest, NextResponse } from "next/server"
import { readSheetData } from "@/lib/google-sheets"
import { parseTransactionFromSheet } from "@/lib/transactions"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, dateFrom, dateTo } = await request.json()

    if (!spreadsheetId || !dateFrom || !dateTo) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 })
    }

    const data = await readSheetData(spreadsheetId, "Transactions!A:K")
    const transactions = data.map(parseTransactionFromSheet)

    // Group by date
    const byDate: Record<string, any> = {}
    transactions.forEach((txn) => {
      if (txn.date >= dateFrom && txn.date <= dateTo) {
        if (!byDate[txn.date]) {
          byDate[txn.date] = {
            date: txn.date,
            transactions: [],
            totalRevenue: 0,
            totalCost: 0,
            totalProfit: 0,
          }
        }
        byDate[txn.date].transactions.push(txn)
        byDate[txn.date].totalRevenue += txn.sellingPrice
        byDate[txn.date].totalCost += txn.cost
        byDate[txn.date].totalProfit += txn.profit
      }
    })

    const result = Object.values(byDate).sort((a: any, b: any) => b.date.localeCompare(a.date))

    return NextResponse.json({ dailyData: result }, { status: 200 })
  } catch (error) {
    console.error("Error getting daily transactions:", error)
    return NextResponse.json({ message: "Failed to get daily transactions" }, { status: 500 })
  }
}
