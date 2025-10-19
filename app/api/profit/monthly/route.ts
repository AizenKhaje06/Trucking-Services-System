// API route for monthly profit calculations

import { calculateMonthlyProfits } from "@/lib/profit-calculator"

export async function GET() {
  try {
    // In production, fetch deliveries from Google Sheets
    const mockDeliveries: any[] = []

    const monthlyProfits = calculateMonthlyProfits(mockDeliveries)

    return Response.json({
      success: true,
      data: monthlyProfits,
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to calculate monthly profits" }, { status: 500 })
  }
}
