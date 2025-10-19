"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Filter, TrendingUp, DollarSign, Truck } from "lucide-react"

interface TransactionReportingProps {
  spreadsheetId: string
}

export function TransactionReporting({ spreadsheetId }: TransactionReportingProps) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [trucks, setTrucks] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Filter states
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedTruck, setSelectedTruck] = useState("all")
  const [selectedMaterial, setSelectedMaterial] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState("all")

  // Analytics data
  const [summary, setSummary] = useState<any>(null)
  const [dailyData, setDailyData] = useState<any[]>([])
  const [truckAnalytics, setTruckAnalytics] = useState<any[]>([])
  const [materialAnalytics, setMaterialAnalytics] = useState<any[]>([])
  const [employeeAnalytics, setEmployeeAnalytics] = useState<any[]>([])

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)

      // Load trucks
      const trucksResponse = await fetch("/api/trucks/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId }),
      })
      if (trucksResponse.ok) {
        const data = await trucksResponse.json()
        setTrucks(data.trucks || [])
      }

      // Load materials
      const materialsResponse = await fetch("/api/sheets/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId, range: "Materials!A:D" }),
      })
      if (materialsResponse.ok) {
        const data = await materialsResponse.json()
        setMaterials(data.data || [])
      }

      // Set default date range (last 30 days)
      const today = new Date()
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      setDateFrom(thirtyDaysAgo.toISOString().split("T")[0])
      setDateTo(today.toISOString().split("T")[0])
    } catch (err) {
      console.error("Error loading initial data:", err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = async () => {
    try {
      setLoading(true)

      // Get filtered transactions
      const filters: any = {}
      if (dateFrom) filters.dateFrom = dateFrom
      if (dateTo) filters.dateTo = dateTo
      if (selectedTruck !== "all") filters.truck = selectedTruck
      if (selectedMaterial !== "all") filters.material = selectedMaterial
      if (selectedEmployee !== "all") filters.employee = selectedEmployee

      const transResponse = await fetch("/api/transactions/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId, filters }),
      })

      if (transResponse.ok) {
        const data = await transResponse.json()
        setTransactions(data.transactions || [])

        // Calculate summary
        const totalRevenue = data.transactions.reduce((sum: number, t: any) => sum + t.sellingPrice, 0)
        const totalCost = data.transactions.reduce((sum: number, t: any) => sum + t.cost, 0)
        const totalProfit = data.transactions.reduce((sum: number, t: any) => sum + t.profit, 0)
        setSummary({
          count: data.transactions.length,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalCost: Math.round(totalCost * 100) / 100,
          totalProfit: Math.round(totalProfit * 100) / 100,
          profitMargin: totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 10000) / 100 : 0,
        })
      }

      // Get daily data
      if (dateFrom && dateTo) {
        const dailyResponse = await fetch("/api/transactions/by-date", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ spreadsheetId, dateFrom, dateTo }),
        })
        if (dailyResponse.ok) {
          const data = await dailyResponse.json()
          setDailyData(data.dailyData || [])
        }
      }

      // Get truck analytics
      const truckResponse = await fetch("/api/transactions/by-truck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId }),
      })
      if (truckResponse.ok) {
        const data = await truckResponse.json()
        setTruckAnalytics(data.byTruck || [])
      }

      // Get material analytics
      const materialResponse = await fetch("/api/transactions/by-material", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId }),
      })
      if (materialResponse.ok) {
        const data = await materialResponse.json()
        setMaterialAnalytics(data.byMaterial || [])
      }

      // Get employee analytics
      const empResponse = await fetch("/api/transactions/by-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId }),
      })
      if (empResponse.ok) {
        const data = await empResponse.json()
        setEmployeeAnalytics(data.byEmployee || [])
      }
    } catch (err) {
      console.error("Error applying filters:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (dateFrom && dateTo) {
      applyFilters()
    }
  }, [])

  const COLORS = ["#f97316", "#4338ca", "#06b6d4", "#10b981", "#f59e0b"]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-accent" />
            Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom" className="text-sm font-semibold">
                From Date
              </Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo" className="text-sm font-semibold">
                To Date
              </Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="truck" className="text-sm font-semibold">
                Truck
              </Label>
              <Select value={selectedTruck} onValueChange={setSelectedTruck}>
                <SelectTrigger id="truck" disabled={loading}>
                  <SelectValue placeholder="All Trucks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trucks</SelectItem>
                  {trucks.map((truck: any) => (
                    <SelectItem key={truck.Truck_ID} value={truck.Truck_ID}>
                      {truck.Truck_ID}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="material" className="text-sm font-semibold">
                Material
              </Label>
              <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                <SelectTrigger id="material" disabled={loading}>
                  <SelectValue placeholder="All Materials" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Materials</SelectItem>
                  {materials.map((material: any, index: number) => (
                    <SelectItem key={index} value={material.Material_Name || ""}>
                      {material.Material_Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={applyFilters}
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {loading ? "Loading..." : "Apply Filters"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Deliveries</p>
                <p className="text-3xl font-bold text-foreground">{summary.count}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-1">
                  <DollarSign className="w-4 h-4" /> Revenue
                </p>
                <p className="text-3xl font-bold text-foreground">${summary.totalRevenue.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Cost</p>
                <p className="text-3xl font-bold text-foreground">${summary.totalCost.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-green-50 dark:bg-green-950/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" /> Total Profit
                </p>
                <p className="text-3xl font-bold text-green-600">${summary.totalProfit.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Profit Margin</p>
                <p className="text-3xl font-bold text-foreground">{summary.profitMargin.toFixed(2)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Profit Trend */}
        {dailyData.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Daily Profit Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="totalProfit" stroke="#10b981" name="Profit" />
                  <Line type="monotone" dataKey="totalRevenue" stroke="#f97316" name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Material Performance */}
        {materialAnalytics.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Material Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={materialAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="material" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalProfit" fill="#10b981" name="Profit" />
                  <Bar dataKey="totalRevenue" fill="#f97316" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Truck Performance Table */}
      {truckAnalytics.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-accent" />
              Truck Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Truck ID</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Avg Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {truckAnalytics.map((truck: any, index: number) => (
                    <TableRow key={index} className="border-border/50">
                      <TableCell className="font-semibold">{truck.truckId}</TableCell>
                      <TableCell>{truck.totalDeliveries}</TableCell>
                      <TableCell>${truck.totalRevenue.toFixed(2)}</TableCell>
                      <TableCell>${truck.totalCost.toFixed(2)}</TableCell>
                      <TableCell className="text-green-600 font-semibold">${truck.totalProfit.toFixed(2)}</TableCell>
                      <TableCell>${truck.avgProfit.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee Performance Table */}
      {employeeAnalytics.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Employee Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Employee</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Avg Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeAnalytics.map((emp: any, index: number) => (
                    <TableRow key={index} className="border-border/50">
                      <TableCell className="font-semibold">{emp.employee}</TableCell>
                      <TableCell>{emp.totalDeliveries}</TableCell>
                      <TableCell>${emp.totalRevenue.toFixed(2)}</TableCell>
                      <TableCell className="text-green-600 font-semibold">${emp.totalProfit.toFixed(2)}</TableCell>
                      <TableCell>${emp.avgProfit.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions Table */}
      {transactions.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>{transactions.length} transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>TXN ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Truck</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((txn: any, index: number) => (
                    <TableRow key={index} className="border-border/50">
                      <TableCell className="font-mono text-xs">{txn.txnId}</TableCell>
                      <TableCell>{txn.date}</TableCell>
                      <TableCell>{txn.employee}</TableCell>
                      <TableCell>{txn.truckId}</TableCell>
                      <TableCell>{txn.material}</TableCell>
                      <TableCell>{txn.quantity}</TableCell>
                      <TableCell className="text-sm">{txn.location}</TableCell>
                      <TableCell>${txn.sellingPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-green-600 font-semibold">${txn.profit.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
