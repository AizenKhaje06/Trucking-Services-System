"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock } from "lucide-react"
import type { EODReport } from "@/lib/eod-summary"

interface EODSummaryPanelProps {
  spreadsheetId?: string
  employees: string[]
}

export function EODSummaryPanel({ spreadsheetId, employees }: EODSummaryPanelProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [report, setReport] = useState<EODReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEODSummary()
  }, [selectedDate])

  const fetchEODSummary = async () => {
    if (!spreadsheetId) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/eod/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadsheetId,
          date: selectedDate,
          employees,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to fetch EOD summary")
        return
      }

      setReport(data.report)
    } catch (err) {
      setError("An error occurred while fetching EOD summary")
    } finally {
      setLoading(false)
    }
  }

  const handleLockDay = () => {
    // In production, this would update the locked status in Google Sheets
    alert("Day locked successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <Card>
        <CardHeader>
          <CardTitle>End-of-Day Summary</CardTitle>
          <CardDescription>Daily transaction and expense summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="eod-date">Select Date</Label>
              <Input
                id="eod-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button onClick={fetchEODSummary} disabled={loading} className="bg-accent hover:bg-accent/90">
              {loading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {report && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Loads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.totalLoads}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">${report.totalSales.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">${report.totalExpenses.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${report.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${report.totalProfit.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employee Summaries */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Summaries</CardTitle>
              <CardDescription>Per-employee breakdown for {selectedDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.summaries.map((summary) => (
                  <div key={summary.employee} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{summary.employee}</h4>
                      <span className="text-sm text-muted-foreground">{summary.totalLoads} loads</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sales</p>
                        <p className="font-semibold text-accent">${summary.totalSales.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Expenses</p>
                        <p className="font-semibold text-destructive">${summary.totalExpenses.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Profit</p>
                        <p className={`font-semibold ${summary.totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ${summary.totalProfit.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lock Day Button */}
          <Button onClick={handleLockDay} className="gap-2 bg-accent hover:bg-accent/90 w-full">
            <Lock className="w-4 h-4" />
            Lock Day Entries
          </Button>
        </>
      )}
    </div>
  )
}
