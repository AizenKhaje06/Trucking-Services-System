import { type NextRequest, NextResponse } from "next/server"
import { readSheetData } from "@/lib/google-sheets"
import { parseTransactionFromSheet } from "@/lib/transactions"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId } = await request.json()

    if (!spreadsheetId) {
      return NextResponse.json({ message: "Missing spreadsheetId" }, { status: 400 })
    }

    const data = await readSheetData(spreadsheetId, "Transactions!A:K")
    const transactions = data.map(parseTransactionFromSheet)

    // Group by employee
    const byEmployee: Record<string, any> = {}
    transactions.forEach((txn) => {
      if (!byEmployee[txn.employee]) {
        byEmployee[txn.employee] = {
          employee: txn.employee,
          totalDeliveries: 0,
          totalRevenue: 0,
          totalProfit: 0,
          avgProfit: 0,
        }
      }
      byEmployee[txn.employee].totalDeliveries += 1
      byEmployee[txn.employee].totalRevenue += txn.sellingPrice
      byEmployee[txn.employee].totalProfit += txn.profit
    })

    // Calculate averages
    Object.values(byEmployee).forEach((emp: any) => {
      emp.avgProfit = emp.totalDeliveries > 0 ? Math.round((emp.totalProfit / emp.totalDeliveries) * 100) / 100 : 0
      emp.totalRevenue = Math.round(emp.totalRevenue * 100) / 100
      emp.totalProfit = Math.round(emp.totalProfit * 100) / 100
    })

    return NextResponse.json({ byEmployee: Object.values(byEmployee) }, { status: 200 })
  } catch (error) {
    console.error("Error getting employee analytics:", error)
    return NextResponse.json({ message: "Failed to get employee analytics" }, { status: 500 })
  }
}
