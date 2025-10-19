// Transaction management utilities for delivery records
export interface Transaction {
  txnId: string
  date: string
  employee: string
  truckId: string
  material: string
  quantity: number
  location: string
  buyer: string
  cost: number
  sellingPrice: number
  profit: number
}

export interface TransactionFormData {
  employee: string
  truckId: string
  material: string
  quantity: number
  location: string
  buyer: string
  cost: number
  sellingPrice: number
}

// Generate unique transaction ID
export function generateTxnId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TXN-${timestamp}-${random}`
}

// Calculate profit
export function calculateProfit(sellingPrice: number, cost: number): number {
  return Math.round((sellingPrice - cost) * 100) / 100
}

// Validate transaction data
export function validateTransaction(data: Partial<TransactionFormData>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.employee?.trim()) errors.push("Employee is required")
  if (!data.truckId?.trim()) errors.push("Truck ID is required")
  if (!data.material?.trim()) errors.push("Material is required")
  if (!data.quantity || data.quantity <= 0) errors.push("Quantity must be greater than 0")
  if (!data.location?.trim()) errors.push("Location is required")
  if (!data.buyer?.trim()) errors.push("Buyer/Customer is required")
  if (data.cost === undefined || data.cost < 0) errors.push("Cost must be a valid number")
  if (data.sellingPrice === undefined || data.sellingPrice < 0) errors.push("Selling price must be a valid number")

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Format transaction for sheet storage
export function formatTransactionForSheet(transaction: TransactionFormData & { txnId: string }): (string | number)[] {
  const profit = calculateProfit(transaction.sellingPrice, transaction.cost)
  return [
    transaction.txnId,
    new Date().toISOString().split("T")[0],
    transaction.employee,
    transaction.truckId,
    transaction.material,
    transaction.quantity,
    transaction.location,
    transaction.buyer,
    transaction.cost,
    transaction.sellingPrice,
    profit,
  ]
}

// Parse transaction from sheet
export function parseTransactionFromSheet(row: Record<string, any>): Transaction {
  return {
    txnId: row.TXN_ID || "",
    date: row.Date || "",
    employee: row.Employee || "",
    truckId: row.Truck_ID || "",
    material: row.Material || "",
    quantity: Number(row.Quantity) || 0,
    location: row.Location || "",
    buyer: row.Buyer_Customer || "",
    cost: Number(row.Cost) || 0,
    sellingPrice: Number(row.Selling_Price) || 0,
    profit: Number(row.Profit) || 0,
  }
}

// Filter transactions by criteria
export function filterTransactions(
  transactions: Transaction[],
  filters: {
    dateFrom?: string
    dateTo?: string
    truck?: string
    material?: string
    employee?: string
    location?: string
  },
): Transaction[] {
  return transactions.filter((txn) => {
    if (filters.dateFrom && txn.date < filters.dateFrom) return false
    if (filters.dateTo && txn.date > filters.dateTo) return false
    if (filters.truck && txn.truckId !== filters.truck) return false
    if (filters.material && txn.material !== filters.material) return false
    if (filters.employee && txn.employee !== filters.employee) return false
    if (filters.location && !txn.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    return true
  })
}

// Calculate transaction summary
export function calculateTransactionSummary(transactions: Transaction[]) {
  const totalRevenue = transactions.reduce((sum, txn) => sum + txn.sellingPrice, 0)
  const totalCost = transactions.reduce((sum, txn) => sum + txn.cost, 0)
  const totalProfit = transactions.reduce((sum, txn) => sum + txn.profit, 0)
  const avgProfit = transactions.length > 0 ? Math.round((totalProfit / transactions.length) * 100) / 100 : 0
  const profitMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 10000) / 100 : 0

  return {
    totalTransactions: transactions.length,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    totalProfit: Math.round(totalProfit * 100) / 100,
    avgProfit,
    profitMargin,
  }
}
