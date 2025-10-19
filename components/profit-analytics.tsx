// Profit analytics dashboard component

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import type { DailyProfit, WeeklyProfit, MonthlyProfit, ProfitSummary } from "@/lib/profit-calculator"

interface ProfitAnalyticsProps {
  deliveries: any[]
}

export function ProfitAnalytics({ deliveries }: ProfitAnalyticsProps) {
  const [dailyData, setDailyData] = useState<DailyProfit[]>([])
  const [weeklyData, setWeeklyData] = useState<WeeklyProfit[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyProfit[]>([])
  const [summary, setSummary] = useState<ProfitSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfitData()
  }, [deliveries])

  const fetchProfitData = async () => {
    try {
      const [dailyRes, weeklyRes, monthlyRes, summaryRes] = await Promise.all([
        fetch("/api/profit/daily"),
        fetch("/api/profit/weekly"),
        fetch("/api/profit/monthly"),
        fetch("/api/profit/summary"),
      ])

      const [dailyJson, weeklyJson, monthlyJson, summaryJson] = await Promise.all([
        dailyRes.json(),
        weeklyRes.json(),
        monthlyRes.json(),
        summaryRes.json(),
      ])

      if (dailyJson.success) setDailyData(dailyJson.data)
      if (weeklyJson.success) setWeeklyData(weeklyJson.data)
      if (monthlyJson.success) setMonthlyData(monthlyJson.data)
      if (summaryJson.success) setSummary(summaryJson.data)
    } catch (error) {
      console.error("Failed to fetch profit data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-muted-foreground">Loading profit analytics...</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summary.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{summary.deliveryCount} deliveries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summary.totalCost.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">operational expenses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">${summary.totalProfit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{summary.profitMargin.toFixed(1)}% margin</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Profit/Delivery</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${summary.averageProfitPerDelivery.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">per transaction</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Daily Profit Chart */}
      {dailyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Profit Trend</CardTitle>
            <CardDescription>Profit performance over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                <Legend />
                <Line type="monotone" dataKey="profit" stroke="var(--accent)" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Weekly Profit Chart */}
      {weeklyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Profit Summary</CardTitle>
            <CardDescription>Profit breakdown by week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                <Legend />
                <Bar dataKey="profit" fill="var(--accent)" />
                <Bar dataKey="cost" fill="var(--destructive)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Monthly Profit Chart */}
      {monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Profit Analysis</CardTitle>
            <CardDescription>Profit performance by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                <Legend />
                <Bar dataKey="profit" fill="var(--accent)" />
                <Bar dataKey="revenue" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
