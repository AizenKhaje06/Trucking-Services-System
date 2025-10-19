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

    // Group by truck
    const byTruck: Record<string, any> = {}
    transactions.forEach((txn) => {
      if (!byTruck[txn.truckId]) {
        byTruck[txn.truckId] = {
          truckId: txn.truckId,
          totalDeliveries: 0,
          totalRevenue: 0,
          totalCost: 0,
          totalProfit: 0,
          avgProfit: 0,
        }
      }
      byTruck[txn.truckId].totalDeliveries += 1
      byTruck[txn.truckId].totalRevenue += txn.sellingPrice
      byTruck[txn.truckId].totalCost += txn.cost
      byTruck[txn.truckId].totalProfit += txn.profit
    })

    // Calculate averages
    Object.values(byTruck).forEach((truck: any) => {
      truck.avgProfit =
        truck.totalDeliveries > 0 ? Math.round((truck.totalProfit / truck.totalDeliveries) * 100) / 100 : 0
      truck.totalRevenue = Math.round(truck.totalRevenue * 100) / 100
      truck.totalCost = Math.round(truck.totalCost * 100) / 100
      truck.totalProfit = Math.round(truck.totalProfit * 100) / 100
    })

    return NextResponse.json({ byTruck: Object.values(byTruck) }, { status: 200 })
  } catch (error) {
    console.error("Error getting truck analytics:", error)
    return NextResponse.json({ message: "Failed to get truck analytics" }, { status: 500 })
  }
}
