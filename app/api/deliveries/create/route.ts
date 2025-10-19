// API route to create a new delivery record

import { generateDeliveryId, calculateDeliveryProfit } from "@/lib/deliveries"

export async function POST(request: Request) {
  try {
    const {
      employeeId,
      employeeName,
      materialId,
      materialName,
      quantity,
      truckId,
      truckName,
      customer,
      deliveryLocation,
      pricePerUnit,
      costPerUnit,
    } = await request.json()

    if (!employeeId || !materialId || !quantity || !truckId || !customer || !deliveryLocation) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const { totalPrice, totalCost, profit } = calculateDeliveryProfit(
      Number.parseFloat(quantity),
      Number.parseFloat(pricePerUnit),
      Number.parseFloat(costPerUnit),
    )

    const newDelivery = {
      id: generateDeliveryId(),
      employeeId,
      employeeName,
      materialId,
      materialName,
      quantity: Number.parseFloat(quantity),
      truckId,
      truckName,
      customer,
      deliveryLocation,
      pricePerUnit: Number.parseFloat(pricePerUnit),
      costPerUnit: Number.parseFloat(costPerUnit),
      totalPrice,
      totalCost,
      profit,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // In production, this would save to Google Sheets
    return Response.json({
      success: true,
      delivery: newDelivery,
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create delivery" }, { status: 500 })
  }
}
