// API route for daily profit calculations

import { calculateDailyProfits } from "@/lib/profit-calculator"

export async function GET() {
  try {
    // In production, fetch deliveries from Google Sheets
    const mockDeliveries = [
      {
        id: "del_001",
        employeeId: "EMP001",
        employeeName: "John Smith",
        materialId: "mat_001",
        materialName: "3/4 Gravel",
        quantity: 10,
        truckId: "truck_001",
        truckName: "Truck #1",
        customer: "ABC Construction",
        deliveryLocation: "123 Main St",
        pricePerUnit: 45,
        costPerUnit: 25,
        totalPrice: 450,
        totalCost: 250,
        profit: 200,
        status: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
    ]

    const dailyProfits = calculateDailyProfits(mockDeliveries)

    return Response.json({
      success: true,
      data: dailyProfits,
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to calculate daily profits" }, { status: 500 })
  }
}
