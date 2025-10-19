// Monthly report generation utilities for comprehensive financial analysis

import type { Transaction } from "./transactions"
import type { Expense } from "./expenses"

export interface MonthlyReportData {
  month: string
  year: number
  totalDeliveries: number
  totalRevenue: number
  totalExpenses: number
  totalProfit: number
  profitMargin: number
  topMaterial: { name: string; quantity: number; revenue: number }
  topTruck: { id: string; deliveries: number; profit: number }
  topEmployee: { name: string; deliveries: number; profit: number }
  expenseBreakdown: Record<string, number>
}

// Get month name from number
function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  return months[month - 1]
}

// Generate monthly report
export function generateMonthlyReport(
  month: number,
  year: number,
  transactions: Transaction[],
  expenses: Expense[],
): MonthlyReportData {
  // Filter transactions and expenses for the month
  const monthTransactions = transactions.filter((t) => {
    const date = new Date(t.date)
    return date.getMonth() + 1 === month && date.getFullYear() === year
  })

  const monthExpenses = expenses.filter((e) => {
    const date = new Date(e.date)
    return date.getMonth() + 1 === month && date.getFullYear() === year
  })

  // Calculate totals
  const totalDeliveries = monthTransactions.length
  const totalRevenue = monthTransactions.reduce((sum, t) => sum + t.sellingPrice, 0)
  const totalCost = monthTransactions.reduce((sum, t) => sum + t.cost, 0)
  const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const totalProfit = totalRevenue - totalCost - totalExpenses
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

  // Find top material
  const materialStats: Record<string, { name: string; quantity: number; revenue: number }> = {}
  monthTransactions.forEach((t) => {
    if (!materialStats[t.material]) {
      materialStats[t.material] = { name: t.material, quantity: 0, revenue: 0 }
    }
    materialStats[t.material].quantity += t.quantity
    materialStats[t.material].revenue += t.sellingPrice
  })
  const topMaterial = Object.values(materialStats).sort((a, b) => b.revenue - a.revenue)[0] || {
    name: "N/A",
    quantity: 0,
    revenue: 0,
  }

  // Find top truck
  const truckStats: Record<string, { id: string; deliveries: number; profit: number }> = {}
  monthTransactions.forEach((t) => {
    if (!truckStats[t.truckId]) {
      truckStats[t.truckId] = { id: t.truckId, deliveries: 0, profit: 0 }
    }
    truckStats[t.truckId].deliveries += 1
    truckStats[t.truckId].profit += t.profit
  })
  const topTruck = Object.values(truckStats).sort((a, b) => b.profit - a.profit)[0] || {
    id: "N/A",
    deliveries: 0,
    profit: 0,
  }

  // Find top employee
  const employeeStats: Record<string, { name: string; deliveries: number; profit: number }> = {}
  monthTransactions.forEach((t) => {
    if (!employeeStats[t.employee]) {
      employeeStats[t.employee] = { name: t.employee, deliveries: 0, profit: 0 }
    }
    employeeStats[t.employee].deliveries += 1
    employeeStats[t.employee].profit += t.profit
  })
  const topEmployee = Object.values(employeeStats).sort((a, b) => b.profit - a.profit)[0] || {
    name: "N/A",
    deliveries: 0,
    profit: 0,
  }

  // Expense breakdown by category
  const expenseBreakdown: Record<string, number> = {}
  monthExpenses.forEach((e) => {
    expenseBreakdown[e.category] = (expenseBreakdown[e.category] || 0) + e.amount
  })

  return {
    month: getMonthName(month),
    year,
    totalDeliveries,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
    profitMargin: Math.round(profitMargin * 100) / 100,
    topMaterial,
    topTruck,
    topEmployee,
    expenseBreakdown,
  }
}

// Generate reports for multiple months
export function generateMonthlyReports(
  months: Array<{ month: number; year: number }>,
  transactions: Transaction[],
  expenses: Expense[],
): MonthlyReportData[] {
  return months.map((m) => generateMonthlyReport(m.month, m.year, transactions, expenses))
}

// Get last N months
export function getLastNMonths(n: number): Array<{ month: number; year: number }> {
  const months: Array<{ month: number; year: number }> = []
  const today = new Date()

  for (let i = 0; i < n; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
    months.push({
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    })
  }

  return months
}
