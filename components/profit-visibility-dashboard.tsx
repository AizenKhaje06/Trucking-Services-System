"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { AlertCircle } from "lucide-react"
import type { Transaction } from "@/lib/transactions"
import type { Expense } from "@/lib/expenses"

interface ProfitVisibilityDashboardProps {
  transactions: Transaction[]
  expenses: Expense[]
}

export function ProfitVisibilityDashboard({ transactions, expenses }: ProfitVisibilityDashboardProps) {
  const [profitByTransaction, setProfitByTransaction] = useState<any[]>([])
  const [profitByTruck, setProfitByTruck] = useState<any[]>([])
  const [profitByEmployee, setProfitByEmployee] = useState<any[]>([])
  const [profitByMaterial, setProfitByMaterial] = useState<any[]>([])
  const [monthlySummary, setMonthlySummary] = useState<any[]>([])

  useEffect(() => {
    calculateProfitViews()
  }, [transactions, expenses])

  const calculateProfitViews = () => {
    // Per Transaction View
    const txnProfits = transactions.map((t, idx) => ({
      id: idx + 1,
      txnId: t.txnId,
      profit: t.profit,
      revenue: t.sellingPrice,
      cost: t.cost,
      material: t.material,
    }))
    setProfitByTransaction(txnProfits)

    // Per Truck View
    const truckMap: Record<string, any> = {}
    transactions.forEach((t) => {
      if (!truckMap[t.truckId]) {
        truckMap[t.truckId] = {
          truck: t.truckId,
          totalProfit: 0,
          totalRevenue: 0,
          deliveries: 0,
          avgProfit: 0,
        }
      }
      truckMap[t.truckId].totalProfit += t.profit
      truckMap[t.truckId].totalRevenue += t.sellingPrice
      truckMap[t.truckId].deliveries += 1
    })

    Object.values(truckMap).forEach((truck: any) => {
      truck.avgProfit = Math.round((truck.totalProfit / truck.deliveries) * 100) / 100
      truck.totalProfit = Math.round(truck.totalProfit * 100) / 100
      truck.totalRevenue = Math.round(truck.totalRevenue * 100) / 100
    })
    setProfitByTruck(Object.values(truckMap).sort((a: any, b: any) => b.totalProfit - a.totalProfit))

    // Per Employee View
    const empMap: Record<string, any> = {}
    transactions.forEach((t) => {
      if (!empMap[t.employee]) {
        empMap[t.employee] = {
          employee: t.employee,
          totalProfit: 0,
          totalRevenue: 0,
          deliveries: 0,
          avgProfit: 0,
        }
      }
      empMap[t.employee].totalProfit += t.profit
      empMap[t.employee].totalRevenue += t.sellingPrice
      empMap[t.employee].deliveries += 1
    })

    Object.values(empMap).forEach((emp: any) => {
      emp.avgProfit = Math.round((emp.totalProfit / emp.deliveries) * 100) / 100
      emp.totalProfit = Math.round(emp.totalProfit * 100) / 100
      emp.totalRevenue = Math.round(emp.totalRevenue * 100) / 100
    })
    setProfitByEmployee(Object.values(empMap).sort((a: any, b: any) => b.totalProfit - a.totalProfit))

    // Per Material View
    const matMap: Record<string, any> = {}
    transactions.forEach((t) => {
      if (!matMap[t.material]) {
        matMap[t.material] = {
          material: t.material,
          totalProfit: 0,
          totalRevenue: 0,
          quantity: 0,
          deliveries: 0,
        }
      }
      matMap[t.material].totalProfit += t.profit
      matMap[t.material].totalRevenue += t.sellingPrice
      matMap[t.material].quantity += t.quantity
      matMap[t.material].deliveries += 1
    })

    Object.values(matMap).forEach((mat: any) => {
      mat.totalProfit = Math.round(mat.totalProfit * 100) / 100
      mat.totalRevenue = Math.round(mat.totalRevenue * 100) / 100
    })
    setProfitByMaterial(Object.values(matMap).sort((a: any, b: any) => b.totalProfit - a.totalProfit))

    // Monthly Summary View
    const monthMap: Record<string, any> = {}
    transactions.forEach((t) => {
      const date = new Date(t.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          month: monthName,
          profit: 0,
          revenue: 0,
          cost: 0,
          deliveries: 0,
        }
      }
      monthMap[monthKey].profit += t.profit
      monthMap[monthKey].revenue += t.sellingPrice
      monthMap[monthKey].cost += t.cost
      monthMap[monthKey].deliveries += 1
    })

    // Deduct expenses from monthly profit
    expenses.forEach((e) => {
      const date = new Date(e.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (monthMap[monthKey]) {
        monthMap[monthKey].profit -= e.amount
      }
    })

    Object.values(monthMap).forEach((month: any) => {
      month.profit = Math.round(month.profit * 100) / 100
      month.revenue = Math.round(month.revenue * 100) / 100
      month.cost = Math.round(month.cost * 100) / 100
    })
    setMonthlySummary(Object.values(monthMap))
  }

  return (
    <Tabs defaultValue="transaction" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="transaction">Per Transaction</TabsTrigger>
        <TabsTrigger value="truck">Per Truck</TabsTrigger>
        <TabsTrigger value="employee">Per Employee</TabsTrigger>
        <TabsTrigger value="material">Per Material</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>

      {/* Per Transaction View */}
      <TabsContent value="transaction" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profit Per Transaction</CardTitle>
            <CardDescription>Individual transaction profitability</CardDescription>
          </CardHeader>
          <CardContent>
            {profitByTransaction.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No transactions available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-2 font-semibold">TXN ID</th>
                      <th className="text-left py-2 px-2 font-semibold">Material</th>
                      <th className="text-left py-2 px-2 font-semibold">Revenue</th>
                      <th className="text-left py-2 px-2 font-semibold">Cost</th>
                      <th className="text-left py-2 px-2 font-semibold">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profitByTransaction.slice(0, 10).map((txn) => (
                      <tr key={txn.txnId} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-2 px-2 text-xs">{txn.txnId}</td>
                        <td className="py-2 px-2">{txn.material}</td>
                        <td className="py-2 px-2">${txn.revenue.toFixed(2)}</td>
                        <td className="py-2 px-2">${txn.cost.toFixed(2)}</td>
                        <td className="py-2 px-2 font-semibold text-accent">${txn.profit.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Per Truck View */}
      <TabsContent value="truck" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profit Per Truck</CardTitle>
            <CardDescription>Truck performance and profitability</CardDescription>
          </CardHeader>
          <CardContent>
            {profitByTruck.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No truck data available</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={profitByTruck}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="truck" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                    <Legend />
                    <Bar dataKey="totalProfit" fill="var(--accent)" name="Total Profit" />
                    <Bar dataKey="avgProfit" fill="var(--primary)" name="Avg Profit" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 font-semibold">Truck</th>
                        <th className="text-left py-2 px-2 font-semibold">Deliveries</th>
                        <th className="text-left py-2 px-2 font-semibold">Total Profit</th>
                        <th className="text-left py-2 px-2 font-semibold">Avg Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profitByTruck.map((truck) => (
                        <tr key={truck.truck} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-2 px-2 font-semibold">{truck.truck}</td>
                          <td className="py-2 px-2">{truck.deliveries}</td>
                          <td className="py-2 px-2 text-accent">${truck.totalProfit.toFixed(2)}</td>
                          <td className="py-2 px-2">${truck.avgProfit.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Per Employee View */}
      <TabsContent value="employee" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profit Per Employee</CardTitle>
            <CardDescription>Employee performance and earnings</CardDescription>
          </CardHeader>
          <CardContent>
            {profitByEmployee.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No employee data available</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={profitByEmployee}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="employee" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                    <Legend />
                    <Bar dataKey="totalProfit" fill="var(--accent)" name="Total Profit" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 font-semibold">Employee</th>
                        <th className="text-left py-2 px-2 font-semibold">Deliveries</th>
                        <th className="text-left py-2 px-2 font-semibold">Total Profit</th>
                        <th className="text-left py-2 px-2 font-semibold">Avg Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profitByEmployee.map((emp) => (
                        <tr key={emp.employee} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-2 px-2 font-semibold">{emp.employee}</td>
                          <td className="py-2 px-2">{emp.deliveries}</td>
                          <td className="py-2 px-2 text-accent">${emp.totalProfit.toFixed(2)}</td>
                          <td className="py-2 px-2">${emp.avgProfit.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Per Material View */}
      <TabsContent value="material" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Profit Per Material</CardTitle>
            <CardDescription>Material profitability analysis</CardDescription>
          </CardHeader>
          <CardContent>
            {profitByMaterial.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No material data available</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={profitByMaterial}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="material" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                    <Legend />
                    <Bar dataKey="totalProfit" fill="var(--accent)" name="Total Profit" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 font-semibold">Material</th>
                        <th className="text-left py-2 px-2 font-semibold">Deliveries</th>
                        <th className="text-left py-2 px-2 font-semibold">Quantity</th>
                        <th className="text-left py-2 px-2 font-semibold">Total Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profitByMaterial.map((mat) => (
                        <tr key={mat.material} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-2 px-2 font-semibold">{mat.material}</td>
                          <td className="py-2 px-2">{mat.deliveries}</td>
                          <td className="py-2 px-2">{mat.quantity}</td>
                          <td className="py-2 px-2 text-accent">${mat.totalProfit.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Monthly Summary View */}
      <TabsContent value="monthly" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Profit Summary</CardTitle>
            <CardDescription>Monthly profitability trends including expenses</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlySummary.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No monthly data available</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlySummary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                    <Legend />
                    <Line type="monotone" dataKey="profit" stroke="var(--accent)" strokeWidth={2} name="Net Profit" />
                    <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} name="Revenue" />
                    <Line type="monotone" dataKey="cost" stroke="var(--destructive)" strokeWidth={2} name="Cost" />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 font-semibold">Month</th>
                        <th className="text-left py-2 px-2 font-semibold">Deliveries</th>
                        <th className="text-left py-2 px-2 font-semibold">Revenue</th>
                        <th className="text-left py-2 px-2 font-semibold">Cost</th>
                        <th className="text-left py-2 px-2 font-semibold">Net Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlySummary.map((month) => (
                        <tr key={month.month} className="border-b border-border/50 hover:bg-muted/50">
                          <td className="py-2 px-2 font-semibold">{month.month}</td>
                          <td className="py-2 px-2">{month.deliveries}</td>
                          <td className="py-2 px-2">${month.revenue.toFixed(2)}</td>
                          <td className="py-2 px-2">${month.cost.toFixed(2)}</td>
                          <td
                            className={`py-2 px-2 font-semibold ${month.profit >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            ${month.profit.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
