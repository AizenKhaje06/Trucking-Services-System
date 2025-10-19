// Profit calculation engine for comprehensive financial analytics

import type { Delivery } from "./deliveries"

export interface ProfitSummary {
  period: string
  totalRevenue: number
  totalCost: number
  totalProfit: number
  profitMargin: number
  deliveryCount: number
  averageProfitPerDelivery: number
}

export interface DailyProfit {
  date: string
  revenue: number
  cost: number
  profit: number
  deliveryCount: number
}

export interface WeeklyProfit {
  week: string
  startDate: string
  endDate: string
  revenue: number
  cost: number
  profit: number
  deliveryCount: number
}

export interface MonthlyProfit {
  month: string
  year: number
  revenue: number
  cost: number
  profit: number
  deliveryCount: number
  profitMargin: number
}

export function calculateDailyProfits(deliveries: Delivery[]): DailyProfit[] {
  const dailyMap: Record<string, DailyProfit> = {}

  deliveries
    .filter((d) => d.status === "completed")
    .forEach((delivery) => {
      const date = delivery.completedAt?.split("T")[0] || delivery.createdAt.split("T")[0]

      if (!dailyMap[date]) {
        dailyMap[date] = {
          date,
          revenue: 0,
          cost: 0,
          profit: 0,
          deliveryCount: 0,
        }
      }

      dailyMap[date].revenue += delivery.totalPrice
      dailyMap[date].cost += delivery.totalCost
      dailyMap[date].profit += delivery.profit
      dailyMap[date].deliveryCount += 1
    })

  return Object.values(dailyMap).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function calculateWeeklyProfits(deliveries: Delivery[]): WeeklyProfit[] {
  const weeklyMap: Record<string, WeeklyProfit> = {}

  deliveries
    .filter((d) => d.status === "completed")
    .forEach((delivery) => {
      const date = new Date(delivery.completedAt || delivery.createdAt)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())

      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      const weekKey = weekStart.toISOString().split("T")[0]

      if (!weeklyMap[weekKey]) {
        weeklyMap[weekKey] = {
          week: `Week of ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          startDate: weekStart.toISOString().split("T")[0],
          endDate: weekEnd.toISOString().split("T")[0],
          revenue: 0,
          cost: 0,
          profit: 0,
          deliveryCount: 0,
        }
      }

      weeklyMap[weekKey].revenue += delivery.totalPrice
      weeklyMap[weekKey].cost += delivery.totalCost
      weeklyMap[weekKey].profit += delivery.profit
      weeklyMap[weekKey].deliveryCount += 1
    })

  return Object.values(weeklyMap).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
}

export function calculateMonthlyProfits(deliveries: Delivery[]): MonthlyProfit[] {
  const monthlyMap: Record<string, MonthlyProfit> = {}

  deliveries
    .filter((d) => d.status === "completed")
    .forEach((delivery) => {
      const date = new Date(delivery.completedAt || delivery.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          month: date.toLocaleDateString("en-US", { month: "long" }),
          year: date.getFullYear(),
          revenue: 0,
          cost: 0,
          profit: 0,
          deliveryCount: 0,
          profitMargin: 0,
        }
      }

      monthlyMap[monthKey].revenue += delivery.totalPrice
      monthlyMap[monthKey].cost += delivery.totalCost
      monthlyMap[monthKey].profit += delivery.profit
      monthlyMap[monthKey].deliveryCount += 1
    })

  // Calculate profit margins
  Object.values(monthlyMap).forEach((month) => {
    month.profitMargin = month.revenue > 0 ? (month.profit / month.revenue) * 100 : 0
  })

  return Object.values(monthlyMap).sort((a, b) => {
    const aDate = new Date(a.year, new Date(`${a.month} 1`).getMonth())
    const bDate = new Date(b.year, new Date(`${b.month} 1`).getMonth())
    return aDate.getTime() - bDate.getTime()
  })
}

export function calculatePeriodSummary(deliveries: Delivery[], startDate?: Date, endDate?: Date): ProfitSummary {
  let filtered = deliveries.filter((d) => d.status === "completed")

  if (startDate && endDate) {
    filtered = filtered.filter((d) => {
      const deliveryDate = new Date(d.completedAt || d.createdAt)
      return deliveryDate >= startDate && deliveryDate <= endDate
    })
  }

  const totalRevenue = filtered.reduce((sum, d) => sum + d.totalPrice, 0)
  const totalCost = filtered.reduce((sum, d) => sum + d.totalCost, 0)
  const totalProfit = filtered.reduce((sum, d) => sum + d.profit, 0)
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
  const averageProfitPerDelivery = filtered.length > 0 ? totalProfit / filtered.length : 0

  return {
    period: startDate && endDate ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}` : "All Time",
    totalRevenue,
    totalCost,
    totalProfit,
    profitMargin,
    deliveryCount: filtered.length,
    averageProfitPerDelivery,
  }
}

export function getTopPerformingMaterials(deliveries: Delivery[], limit = 5) {
  const materialStats: Record<string, { name: string; profit: number; revenue: number; quantity: number }> = {}

  deliveries
    .filter((d) => d.status === "completed")
    .forEach((d) => {
      if (!materialStats[d.materialId]) {
        materialStats[d.materialId] = {
          name: d.materialName,
          profit: 0,
          revenue: 0,
          quantity: 0,
        }
      }
      materialStats[d.materialId].profit += d.profit
      materialStats[d.materialId].revenue += d.totalPrice
      materialStats[d.materialId].quantity += d.quantity
    })

  return Object.values(materialStats)
    .sort((a, b) => b.profit - a.profit)
    .slice(0, limit)
}

export function getTopPerformingEmployees(deliveries: Delivery[], limit = 5) {
  const employeeStats: Record<string, { name: string; profit: number; revenue: number; deliveryCount: number }> = {}

  deliveries
    .filter((d) => d.status === "completed")
    .forEach((d) => {
      if (!employeeStats[d.employeeId]) {
        employeeStats[d.employeeId] = {
          name: d.employeeName,
          profit: 0,
          revenue: 0,
          deliveryCount: 0,
        }
      }
      employeeStats[d.employeeId].profit += d.profit
      employeeStats[d.employeeId].revenue += d.totalPrice
      employeeStats[d.employeeId].deliveryCount += 1
    })

  return Object.values(employeeStats)
    .sort((a, b) => b.profit - a.profit)
    .slice(0, limit)
}
