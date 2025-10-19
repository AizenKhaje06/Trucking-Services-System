// Delivery recording and management utilities

export interface Delivery {
  id: string
  employeeId: string
  employeeName: string
  materialId: string
  materialName: string
  quantity: number
  truckId: string
  truckName: string
  customer: string
  deliveryLocation: string
  pricePerUnit: number
  costPerUnit: number
  totalPrice: number
  totalCost: number
  profit: number
  status: "pending" | "completed" | "cancelled"
  createdAt: string
  completedAt?: string
}

export interface DeliveryData {
  deliveries: Delivery[]
}

export function generateDeliveryId(): string {
  return `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function calculateDeliveryProfit(quantity: number, pricePerUnit: number, costPerUnit: number) {
  const totalPrice = quantity * pricePerUnit
  const totalCost = quantity * costPerUnit
  const profit = totalPrice - totalCost

  return {
    totalPrice,
    totalCost,
    profit,
  }
}

export function getDeliveryStats(deliveries: Delivery[]) {
  const completed = deliveries.filter((d) => d.status === "completed")
  const totalDeliveries = completed.length
  const totalRevenue = completed.reduce((sum, d) => sum + d.totalPrice, 0)
  const totalCost = completed.reduce((sum, d) => sum + d.totalCost, 0)
  const totalProfit = completed.reduce((sum, d) => sum + d.profit, 0)

  return {
    totalDeliveries,
    totalRevenue,
    totalCost,
    totalProfit,
    averageProfitPerDelivery: totalDeliveries > 0 ? totalProfit / totalDeliveries : 0,
  }
}
