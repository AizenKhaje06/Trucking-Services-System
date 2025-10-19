// End-of-Day summary utilities for daily transaction and expense aggregation

import type { Transaction } from "./transactions"
import type { Expense } from "./expenses"

export interface EODSummary {
  date: string
  employee: string
  totalLoads: number
  totalSales: number
  totalExpenses: number
  totalProfit: number
  transactions: Transaction[]
  expenses: Expense[]
  locked: boolean
}

export interface EODReport {
  date: string
  summaries: EODSummary[]
  totalLoads: number
  totalSales: number
  totalExpenses: number
  totalProfit: number
}

// Calculate EOD summary for a specific date
export function calculateEODSummary(
  date: string,
  employee: string,
  transactions: Transaction[],
  expenses: Expense[],
): EODSummary {
  const dayTransactions = transactions.filter((t) => t.date === date && t.employee === employee)
  const dayExpenses = expenses.filter((e) => e.date === date)

  const totalLoads = dayTransactions.length
  const totalSales = dayTransactions.reduce((sum, t) => sum + t.sellingPrice, 0)
  const totalExpenses = dayExpenses.reduce((sum, e) => sum + e.amount, 0)
  const totalProfit = dayTransactions.reduce((sum, t) => sum + t.profit, 0) - totalExpenses

  return {
    date,
    employee,
    totalLoads,
    totalSales: Math.round(totalSales * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
    transactions: dayTransactions,
    expenses: dayExpenses,
    locked: false,
  }
}

// Generate EOD report for a specific date across all employees
export function generateEODReport(
  date: string,
  transactions: Transaction[],
  expenses: Expense[],
  employees: string[],
): EODReport {
  const summaries = employees.map((emp) => calculateEODSummary(date, emp, transactions, expenses))

  const totalLoads = summaries.reduce((sum, s) => sum + s.totalLoads, 0)
  const totalSales = summaries.reduce((sum, s) => sum + s.totalSales, 0)
  const totalExpenses = summaries.reduce((sum, s) => sum + s.totalExpenses, 0)
  const totalProfit = summaries.reduce((sum, s) => sum + s.totalProfit, 0)

  return {
    date,
    summaries,
    totalLoads,
    totalSales: Math.round(totalSales * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
  }
}

// Get EOD summaries for a date range
export function getEODSummariesByDateRange(
  dateFrom: string,
  dateTo: string,
  transactions: Transaction[],
  expenses: Expense[],
  employees: string[],
): EODReport[] {
  const reports: EODReport[] = []
  const currentDate = new Date(dateFrom)
  const endDate = new Date(dateTo)

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0]
    const report = generateEODReport(dateStr, transactions, expenses, employees)
    if (report.summaries.some((s) => s.totalLoads > 0)) {
      reports.push(report)
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return reports
}
