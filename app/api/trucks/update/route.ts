import { type NextRequest, NextResponse } from "next/server"
import { readSheetData, writeSheetData } from "@/lib/google-sheets"
import { validateTruck } from "@/lib/trucks"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, truckId, truck } = await request.json()

    if (!spreadsheetId || !truckId || !truck) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 })
    }

    const validation = validateTruck(truck)
    if (!validation.valid) {
      return NextResponse.json({ message: "Validation failed", errors: validation.errors }, { status: 400 })
    }

    const trucks = await readSheetData(spreadsheetId, "Trucks!A:F")
    const truckIndex = trucks.findIndex((t: any) => t.Truck_ID === truckId)

    if (truckIndex === -1) {
      return NextResponse.json({ message: "Truck not found" }, { status: 404 })
    }

    const updatedRow = [
      truck.truckId,
      truck.plateNo,
      truck.capacity,
      truck.driver,
      truck.status,
      new Date().toISOString(),
    ]
    const range = `Trucks!A${truckIndex + 2}:F${truckIndex + 2}`
    await writeSheetData(spreadsheetId, range, [updatedRow])

    return NextResponse.json({ message: "Truck updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error updating truck:", error)
    return NextResponse.json({ message: "Failed to update truck" }, { status: 500 })
  }
}
