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

    // Group by material
    const byMaterial: Record<string, any> = {}
    transactions.forEach((txn) => {
      if (!byMaterial[txn.material]) {
        byMaterial[txn.material] = {
          material: txn.material,
          totalQuantity: 0,
          totalRevenue: 0,
          totalCost: 0,
          totalProfit: 0,
          deliveryCount: 0,
        }
      }
      byMaterial[txn.material].totalQuantity += txn.quantity
      byMaterial[txn.material].totalRevenue += txn.sellingPrice
      byMaterial[txn.material].totalCost += txn.cost
      byMaterial[txn.material].totalProfit += txn.profit
      byMaterial[txn.material].deliveryCount += 1
    })

    // Format values
    Object.values(byMaterial).forEach((material: any) => {
      material.totalRevenue = Math.round(material.totalRevenue * 100) / 100
      material.totalCost = Math.round(material.totalCost * 100) / 100
      material.totalProfit = Math.round(material.totalProfit * 100) / 100
    })

    return NextResponse.json({ byMaterial: Object.values(byMaterial) }, { status: 200 })
  } catch (error) {
    console.error("Error getting material analytics:", error)
    return NextResponse.json({ message: "Failed to get material analytics" }, { status: 500 })
  }
}
