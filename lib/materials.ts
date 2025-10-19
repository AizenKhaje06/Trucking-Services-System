// Material management utilities for handling material types, pricing, and operations

export interface Material {
  id: string
  name: string
  unit: "cubic_meter" | "truckload"
  pricePerUnit: number
  costPerUnit: number
  createdAt: string
  updatedAt: string
}

export interface MaterialData {
  materials: Material[]
}

// Default materials for trucking/construction
export const DEFAULT_MATERIALS: Material[] = [
  {
    id: "mat_001",
    name: "3/4 Gravel",
    unit: "cubic_meter",
    pricePerUnit: 45,
    costPerUnit: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mat_002",
    name: "3/8 Gravel",
    unit: "cubic_meter",
    pricePerUnit: 42,
    costPerUnit: 23,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mat_003",
    name: "G1 Stone",
    unit: "cubic_meter",
    pricePerUnit: 50,
    costPerUnit: 28,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mat_004",
    name: "Blue Sand",
    unit: "cubic_meter",
    pricePerUnit: 38,
    costPerUnit: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "mat_005",
    name: "Base Course",
    unit: "cubic_meter",
    pricePerUnit: 55,
    costPerUnit: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function generateMaterialId(): string {
  return `mat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function calculateProfit(quantity: number, pricePerUnit: number, costPerUnit: number): number {
  return (pricePerUnit - costPerUnit) * quantity
}
