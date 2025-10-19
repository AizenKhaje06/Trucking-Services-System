// API route to fetch all materials

import { DEFAULT_MATERIALS } from "@/lib/materials"

export async function GET() {
  try {
    // In production, this would fetch from Google Sheets
    // For now, returning default materials
    return Response.json({
      success: true,
      materials: DEFAULT_MATERIALS,
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch materials" }, { status: 500 })
  }
}
