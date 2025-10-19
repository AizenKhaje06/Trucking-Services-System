// API route to update material pricing (Owner only)

export async function PUT(request: Request) {
  try {
    const { id, name, pricePerUnit, costPerUnit } = await request.json()

    if (!id) {
      return Response.json({ success: false, error: "Material ID is required" }, { status: 400 })
    }

    const updatedMaterial = {
      id,
      name,
      pricePerUnit: Number.parseFloat(pricePerUnit),
      costPerUnit: Number.parseFloat(costPerUnit),
      updatedAt: new Date().toISOString(),
    }

    // In production, this would update Google Sheets
    return Response.json({
      success: true,
      material: updatedMaterial,
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update material" }, { status: 500 })
  }
}
