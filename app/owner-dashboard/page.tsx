"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { LogOut, Plus, TrendingUp, Users, Truck, DollarSign, Package, AlertCircle } from "lucide-react"
import { MaterialManager } from "@/components/material-manager"
import { EODSummaryPanel } from "@/components/eod-summary-panel"
import { ExpenseManager } from "@/components/expense-manager"
import { MonthlyReportViewer } from "@/components/monthly-report-viewer"
import { ProfitVisibilityDashboard } from "@/components/profit-visibility-dashboard"
import type { Material } from "@/lib/materials"
import type { Delivery } from "@/lib/deliveries"
import type { Expense } from "@/lib/expenses"

interface Session {
  userId: string
  name: string
  role: string
  email: string
  loginTime: string
}

interface DashboardStats {
  totalDeliveries: number
  totalRevenue: number
  totalProfit: number
  totalCost: number
  employeeCount: number
}

export default function OwnerDashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalDeliveries: 0,
    totalRevenue: 0,
    totalProfit: 0,
    totalCost: 0,
    employeeCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<
    "overview" | "materials" | "deliveries" | "employees" | "expenses" | "eod" | "reports" | "profit"
  >("overview")

  useEffect(() => {
    fetchSession()
    fetchDashboardData()
  }, [])

  const fetchSession = async () => {
    try {
      const response = await fetch("/api/auth/session")
      if (response.ok) {
        const sessionData = await response.json()
        setSession(sessionData.session)
      }
    } catch (error) {
      console.error("Failed to fetch session:", error)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const [materialsRes, deliveriesRes, expensesRes, transactionsRes] = await Promise.all([
        fetch("/api/materials/list"),
        fetch("/api/deliveries/list"),
        fetch("/api/expenses/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
            filters: {},
          }),
        }),
        fetch("/api/transactions/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
          }),
        }),
      ])

      const materialsData = await materialsRes.json()
      const deliveriesData = await deliveriesRes.json()
      const expensesData = await expensesRes.json()
      const transactionsData = await transactionsRes.json()

      if (materialsData.success) {
        setMaterials(materialsData.materials)
      }

      if (deliveriesData.success) {
        setDeliveries(deliveriesData.deliveries)
        const completed = deliveriesData.deliveries.filter((d: Delivery) => d.status === "completed")
        const totalRevenue = completed.reduce((sum: number, d: Delivery) => sum + d.totalPrice, 0)
        const totalCost = completed.reduce((sum: number, d: Delivery) => sum + d.totalCost, 0)
        const totalProfit = completed.reduce((sum: number, d: Delivery) => sum + d.profit, 0)

        setStats({
          totalDeliveries: completed.length,
          totalRevenue,
          totalProfit,
          totalCost,
          employeeCount: 15,
        })
      }

      if (expensesData.expenses) {
        setExpenses(expensesData.expenses)
      }

      if (transactionsData.transactions) {
        setTransactions(transactionsData.transactions)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    }
    window.location.href = "/"
  }

  const getProfitTrendData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    return last7Days.map((date) => {
      const dayDeliveries = deliveries.filter((d) => d.status === "completed" && d.completedAt?.startsWith(date))
      const profit = dayDeliveries.reduce((sum, d) => sum + d.profit, 0)
      const revenue = dayDeliveries.reduce((sum, d) => sum + d.totalPrice, 0)

      return {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        profit,
        revenue,
      }
    })
  }

  const getMaterialPerformance = () => {
    const materialStats: Record<string, { name: string; quantity: number; profit: number }> = {}

    deliveries
      .filter((d) => d.status === "completed")
      .forEach((d) => {
        if (!materialStats[d.materialId]) {
          materialStats[d.materialId] = {
            name: d.materialName,
            quantity: 0,
            profit: 0,
          }
        }
        materialStats[d.materialId].quantity += d.quantity
        materialStats[d.materialId].profit += d.profit
      })

    return Object.values(materialStats).slice(0, 5)
  }

  const vehicleData = [
    { name: "Active", value: 12, fill: "#ff8c42" },
    { name: "Maintenance", value: 3, fill: "#1e40af" },
    { name: "Idle", value: 5, fill: "#9ca3af" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-accent p-2 rounded-lg">
              <Truck className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">TruckFlow</h1>
              <p className="text-sm text-muted-foreground">Fleet Owner Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{session.name}</p>
              <p className="text-xs text-muted-foreground">{session.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto">
          {(["overview", "materials", "deliveries", "employees", "expenses", "eod", "reports", "profit"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "overview"
                  ? "Overview"
                  : tab === "materials"
                    ? "Materials"
                    : tab === "deliveries"
                      ? "Deliveries"
                      : tab === "employees"
                        ? "Employees"
                        : tab === "expenses"
                          ? "Expenses"
                          : tab === "eod"
                            ? "EOD Summary"
                            : tab === "reports"
                              ? "Monthly Reports"
                              : "Profit Analysis"}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
                  <Package className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
                  <p className="text-xs text-muted-foreground">completed this month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">from all deliveries</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                  <TrendingUp className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">${stats.totalProfit.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">net profit margin</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Employees</CardTitle>
                  <Users className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.employeeCount}</div>
                  <p className="text-xs text-muted-foreground">active drivers</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Profit Trend Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profit & Revenue Trend</CardTitle>
                  <CardDescription>Last 7 days performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={getProfitTrendData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                      <Legend />
                      <Line type="monotone" dataKey="profit" stroke="var(--accent)" strokeWidth={2} />
                      <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Vehicle Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Status</CardTitle>
                  <CardDescription>Fleet distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={vehicleData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {vehicleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Material Performance */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Top Materials by Profit</CardTitle>
                <CardDescription>Best performing materials this month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getMaterialPerformance()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                    <Bar dataKey="profit" fill="var(--accent)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Deliveries */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Deliveries</CardTitle>
                <CardDescription>Latest 5 completed deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deliveries
                    .filter((d) => d.status === "completed")
                    .slice(-5)
                    .reverse()
                    .map((delivery) => (
                      <div key={delivery.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            {delivery.materialName} - {delivery.quantity} units
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {delivery.customer} → {delivery.deliveryLocation}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm text-accent">${delivery.profit.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">profit</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Materials Tab */}
        {activeTab === "materials" && (
          <Card>
            <CardHeader>
              <CardTitle>Material Management</CardTitle>
              <CardDescription>Define and manage your material catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <MaterialManager onMaterialsUpdate={setMaterials} />
            </CardContent>
          </Card>
        )}

        {/* Deliveries Tab */}
        {activeTab === "deliveries" && (
          <Card>
            <CardHeader>
              <CardTitle>All Deliveries</CardTitle>
              <CardDescription>View and manage all delivery records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deliveries.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No deliveries recorded yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-2 font-semibold">Employee</th>
                          <th className="text-left py-2 px-2 font-semibold">Material</th>
                          <th className="text-left py-2 px-2 font-semibold">Qty</th>
                          <th className="text-left py-2 px-2 font-semibold">Customer</th>
                          <th className="text-left py-2 px-2 font-semibold">Revenue</th>
                          <th className="text-left py-2 px-2 font-semibold">Profit</th>
                          <th className="text-left py-2 px-2 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveries.map((delivery) => (
                          <tr key={delivery.id} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-2 px-2">{delivery.employeeName}</td>
                            <td className="py-2 px-2">{delivery.materialName}</td>
                            <td className="py-2 px-2">{delivery.quantity}</td>
                            <td className="py-2 px-2">{delivery.customer}</td>
                            <td className="py-2 px-2">${delivery.totalPrice.toFixed(2)}</td>
                            <td className="py-2 px-2 font-semibold text-accent">${delivery.profit.toFixed(2)}</td>
                            <td className="py-2 px-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                  delivery.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : delivery.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                {delivery.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <Card>
            <CardHeader>
              <CardTitle>Employee Management</CardTitle>
              <CardDescription>Manage employee accounts and credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="gap-2 bg-accent hover:bg-accent/90">
                  <Plus className="w-4 h-4" />
                  Add New Employee
                </Button>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Employee management interface coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expenses Tab */}
        {activeTab === "expenses" && (
          <ExpenseManager
            expenses={expenses}
            trucks={[]} // Pass trucks from state if available
            onExpenseCreated={fetchDashboardData}
          />
        )}

        {/* EOD Summary Tab */}
        {activeTab === "eod" && (
          <EODSummaryPanel
            spreadsheetId={process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID}
            employees={["John Smith", "Jane Doe", "Mike Johnson"]} // Get from actual employee list
          />
        )}

        {/* Monthly Reports Tab */}
        {activeTab === "reports" && <MonthlyReportViewer spreadsheetId={process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID} />}

        {/* Profit Visibility Tab */}
        {activeTab === "profit" && <ProfitVisibilityDashboard transactions={transactions} expenses={expenses} />}
      </main>
    </div>
  )
}
