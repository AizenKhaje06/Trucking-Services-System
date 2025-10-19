// API route to create a new material (Owner only)

import { generateMaterialId } from "@/lib/materials"

export async function POST(request: Request) {
  try {
    const { name, unit, pricePerUnit, costPerUnit } = await request.json()

    if (!name || !unit || pricePerUnit === undefined || costPerUnit === undefined) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const newMaterial = {
      id: generateMaterialId(),
      name,
      unit,
      pricePerUnit: Number.parseFloat(pricePerUnit),
      costPerUnit: Number.parseFloat(costPerUnit),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In production, this would save to Google Sheets
    return Response.json({
      success: true,
      material: newMaterial,
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create material" }, { status: 500 })
  }
}
