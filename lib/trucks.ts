// Truck management utilities for fleet operations
export interface Truck {
  truckId: string
  plateNo: string
  capacity: number
  driver: string
  status: "active" | "inactive" | "maintenance"
  createdAt: string
  lastUpdated: string
}

export interface TruckFormData {
  truckId: string
  plateNo: string
  capacity: number
  driver: string
  status: "active" | "inactive" | "maintenance"
}

// Validate truck data
export function validateTruck(data: Partial<TruckFormData>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.truckId?.trim()) errors.push("Truck ID is required")
  if (!data.plateNo?.trim()) errors.push("Plate number is required")
  if (!data.capacity || data.capacity <= 0) errors.push("Capacity must be greater than 0")
  if (!data.driver?.trim()) errors.push("Driver name is required")
  if (!data.status) errors.push("Status is required")

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Format truck data for sheet storage
export function formatTruckForSheet(truck: TruckFormData): (string | number)[] {
  return [truck.truckId, truck.plateNo, truck.capacity, truck.driver, truck.status, new Date().toISOString()]
}

// Parse truck data from sheet
export function parseTruckFromSheet(row: Record<string, any>): Truck {
  return {
    truckId: row.Truck_ID || "",
    plateNo: row.Plate_No || "",
    capacity: Number(row.Capacity) || 0,
    driver: row.Driver || "",
    status: (row.Status as "active" | "inactive" | "maintenance") || "active",
    createdAt: row.Created_At || "",
    lastUpdated: row.Last_Updated || "",
  }
}
