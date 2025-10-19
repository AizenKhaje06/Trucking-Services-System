// API route to update delivery status

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json()

    if (!id || !status) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const validStatuses = ["pending", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return Response.json({ success: false, error: "Invalid status" }, { status: 400 })
    }

    const updatedDelivery = {
      id,
      status,
      completedAt: status === "completed" ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    }

    // In production, this would update Google Sheets
    return Response.json({
      success: true,
      delivery: updatedDelivery,
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update delivery" }, { status: 500 })
  }
}
