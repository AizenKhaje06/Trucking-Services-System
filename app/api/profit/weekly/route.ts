// API route for weekly profit calculations

import { calculateWeeklyProfits } from "@/lib/profit-calculator"

export async function GET() {
  try {
    // In production, fetch deliveries from Google Sheets
    const mockDeliveries: any[] = []

    const weeklyProfits = calculateWeeklyProfits(mockDeliveries)

    return Response.json({
      success: true,
      data: weeklyProfits,
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to calculate weekly profits" }, { status: 500 })
  }
}
