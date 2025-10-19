// Expense management utilities for tracking operational costs

export interface Expense {
  expId: string
  date: string
  truckId: string
  description: string
  amount: number
  category: "fuel" | "maintenance" | "toll" | "labor" | "other"
}

export interface ExpenseFormData {
  truckId: string
  description: string
  amount: number
  category: "fuel" | "maintenance" | "toll" | "labor" | "other"
}

// Generate unique expense ID
export function generateExpId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `EXP-${timestamp}-${random}`
}

// Validate expense data
export function validateExpense(data: Partial<ExpenseFormData>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.truckId?.trim()) errors.push("Truck ID is required")
  if (!data.description?.trim()) errors.push("Description is required")
  if (data.amount === undefined || data.amount <= 0) errors.push("Amount must be greater than 0")
  if (!data.category) errors.push("Category is required")

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Format expense for sheet storage
export function formatExpenseForSheet(expense: ExpenseFormData & { expId: string }): (string | number)[] {
  return [
    expense.expId,
    new Date().toISOString().split("T")[0],
    expense.truckId,
    expense.description,
    expense.amount,
    expense.category,
  ]
}

// Parse expense from sheet
export function parseExpenseFromSheet(row: Record<string, any>): Expense {
  return {
    expId: row.EXP_ID || "",
    date: row.Date || "",
    truckId: row.Truck_ID || "",
    description: row.Description || "",
    amount: Number(row.Amount) || 0,
    category: (row.Category || "other") as any,
  }
}

// Filter expenses by criteria
export function filterExpenses(
  expenses: Expense[],
  filters: {
    dateFrom?: string
    dateTo?: string
    truck?: string
    category?: string
  },
): Expense[] {
  return expenses.filter((exp) => {
    if (filters.dateFrom && exp.date < filters.dateFrom) return false
    if (filters.dateTo && exp.date > filters.dateTo) return false
    if (filters.truck && exp.truckId !== filters.truck) return false
    if (filters.category && exp.category !== filters.category) return false
    return true
  })
}

// Calculate expense summary
export function calculateExpenseSummary(expenses: Expense[]) {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const byCategory: Record<string, number> = {}

  expenses.forEach((exp) => {
    byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount
  })

  return {
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    byCategory,
    expenseCount: expenses.length,
  }
}
