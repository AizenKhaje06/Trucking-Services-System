// API route to fetch deliveries with optional filtering

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get("employeeId")
    const status = searchParams.get("status")

    // In production, this would fetch from Google Sheets with filters
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
        deliveryLocation: "123 Main St, City",
        pricePerUnit: 45,
        costPerUnit: 25,
        totalPrice: 450,
        totalCost: 250,
        profit: 200,
        status: "completed",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        completedAt: new Date(Date.now() - 82800000).toISOString(),
      },
    ]

    let filtered = mockDeliveries

    if (employeeId) {
      filtered = filtered.filter((d) => d.employeeId === employeeId)
    }

    if (status) {
      filtered = filtered.filter((d) => d.status === status)
    }

    return Response.json({
      success: true,
      deliveries: filtered,
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch deliveries" }, { status: 500 })
  }
}
