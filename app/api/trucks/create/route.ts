import { type NextRequest, NextResponse } from "next/server"
import { appendSheetData } from "@/lib/google-sheets"
import { validateTruck, formatTruckForSheet } from "@/lib/trucks"

export async function POST(request: NextRequest) {
  try {
    const { spreadsheetId, truck } = await request.json()

    if (!spreadsheetId || !truck) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 })
    }

    const validation = validateTruck(truck)
    if (!validation.valid) {
      return NextResponse.json({ message: "Validation failed", errors: validation.errors }, { status: 400 })
    }

    const formattedTruck = formatTruckForSheet(truck)
    await appendSheetData(spreadsheetId, "Trucks!A:F", [formattedTruck])

    return NextResponse.json({ message: "Truck created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating truck:", error)
    return NextResponse.json({ message: "Failed to create truck" }, { status: 500 })
  }
}
