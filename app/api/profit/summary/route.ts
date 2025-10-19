// API route for profit summary calculations

import { calculatePeriodSummary } from "@/lib/profit-calculator"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDateStr = searchParams.get("startDate")
    const endDateStr = searchParams.get("endDate")

    // In production, fetch deliveries from Google Sheets
    const mockDeliveries: any[] = []

    const startDate = startDateStr ? new Date(startDateStr) : undefined
    const endDate = endDateStr ? new Date(endDateStr) : undefined

    const summary = calculatePeriodSummary(mockDeliveries, startDate, endDate)

    return Response.json({
      success: true,
      data: summary,
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to calculate profit summary" }, { status: 500 })
  }
}
