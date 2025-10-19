"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download } from "lucide-react"
import type { MonthlyReportData } from "@/lib/monthly-report"

interface MonthlyReportViewerProps {
  spreadsheetId?: string
}

export function MonthlyReportViewer({ spreadsheetId }: MonthlyReportViewerProps) {
  const [reports, setReports] = useState<MonthlyReportData[]>([])
  const [selectedReport, setSelectedReport] = useState<MonthlyReportData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMonthlyReports()
  }, [])

  const fetchMonthlyReports = async () => {
    if (!spreadsheetId) return

    setLoading(true)

    try {
      const response = await fetch("/api/reports/monthly-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId, months: 12 }),
      })

      const data = await response.json()

      if (data.success && data.reports.length > 0) {
        setReports(data.reports)
        setSelectedReport(data.reports[0])
      }
    } catch (error) {
      console.error("Failed to fetch monthly reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!selectedReport) return

    const csv = [
      ["Monthly Report", selectedReport.month, selectedReport.year],
      [],
      ["Metric", "Value"],
      ["Total Deliveries", selectedReport.totalDeliveries],
      ["Total Revenue", `$${selectedReport.totalRevenue}`],
      ["Total Expenses", `$${selectedReport.totalExpenses}`],
      ["Total Profit", `$${selectedReport.totalProfit}`],
      ["Profit Margin", `${selectedReport.profitMargin}%`],
      [],
      ["Top Material", selectedReport.topMaterial.name],
      ["Top Truck", selectedReport.topTruck.id],
      ["Top Employee", selectedReport.topEmployee.name],
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `monthly-report-${selectedReport.month}-${selectedReport.year}.csv`
    a.click()
  }

  if (loading) {
    return <div className="text-muted-foreground">Loading monthly reports...</div>
  }

  if (!selectedReport) {
    return <div className="text-muted-foreground">No reports available</div>
  }

  const expenseChartData = Object.entries(selectedReport.expenseBreakdown).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
  }))

  const colors = ["#ff8c42", "#1e40af", "#10b981", "#f59e0b", "#8b5cf6"]

  return (
    <div className="space-y-6">
      {/* Report Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Reports</CardTitle>
          <CardDescription>View and export monthly financial reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium">Select Month</label>
              <Select
                value={`${selectedReport.month}-${selectedReport.year}`}
                onValueChange={(val) => {
                  const report = reports.find((r) => `${r.month}-${r.year}` === val)
                  if (report) setSelectedReport(report)
                }}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reports.map((report) => (
                    <SelectItem key={`${report.month}-${report.year}`} value={`${report.month}-${report.year}`}>
                      {report.month} {report.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleExport} className="gap-2 bg-accent hover:bg-accent/90">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedReport.totalDeliveries}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">${selectedReport.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${selectedReport.totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${selectedReport.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              ${selectedReport.totalProfit.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedReport.profitMargin.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Top Material</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{selectedReport.topMaterial.name}</p>
            <p className="text-sm text-muted-foreground">
              {selectedReport.topMaterial.quantity} units • ${selectedReport.topMaterial.revenue.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Top Truck</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{selectedReport.topTruck.id}</p>
            <p className="text-sm text-muted-foreground">
              {selectedReport.topTruck.deliveries} deliveries • ${selectedReport.topTruck.profit.toFixed(2)} profit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Top Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{selectedReport.topEmployee.name}</p>
            <p className="text-sm text-muted-foreground">
              {selectedReport.topEmployee.deliveries} deliveries • ${selectedReport.topEmployee.profit.toFixed(2)}{" "}
              profit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown Chart */}
      {expenseChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Distribution of operational expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
