"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, MapPin, Clock, DollarSign, AlertCircle, TrendingUp } from "lucide-react"
import { DeliveryForm } from "@/components/delivery-form"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Material } from "@/lib/materials"
import type { Delivery } from "@/lib/deliveries"

interface Session {
  userId: string
  name: string
  role: string
  email: string
  loginTime: string
}

interface EmployeeStats {
  totalDeliveries: number
  completedDeliveries: number
  totalEarnings: number
  totalProfit: number
}

export default function EmployeePortal() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [stats, setStats] = useState<EmployeeStats>({
    totalDeliveries: 0,
    completedDeliveries: 0,
    totalEarnings: 0,
    totalProfit: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "record" | "history">("overview")

  useEffect(() => {
    fetchSession()
  }, [])

  const fetchSession = async () => {
    try {
      const response = await fetch("/api/auth/session")
      if (response.ok) {
        const sessionData = await response.json()
        setSession(sessionData.session)
        fetchEmployeeData(sessionData.session.userId)
      }
    } catch (error) {
      console.error("Failed to fetch session:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployeeData = async (employeeId: string) => {
    try {
      const [materialsRes, deliveriesRes] = await Promise.all([
        fetch("/api/materials/list"),
        fetch(`/api/deliveries/list?employeeId=${employeeId}`),
      ])

      const materialsData = await materialsRes.json()
      const deliveriesData = await deliveriesRes.json()

      if (materialsData.success) {
        setMaterials(materialsData.materials)
      }

      if (deliveriesData.success) {
        setDeliveries(deliveriesData.deliveries)
        const completed = deliveriesData.deliveries.filter((d: Delivery) => d.status === "completed")
        const totalEarnings = completed.reduce((sum: number, d: Delivery) => sum + d.totalPrice, 0)
        const totalProfit = completed.reduce((sum: number, d: Delivery) => sum + d.profit, 0)

        setStats({
          totalDeliveries: deliveriesData.deliveries.length,
          completedDeliveries: completed.length,
          totalEarnings,
          totalProfit,
        })
      }
    } catch (error) {
      console.error("Failed to fetch employee data:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleDeliveryCreated = () => {
    if (session) {
      fetchEmployeeData(session.userId)
    }
  }

  const getEarningsTrendData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    return last7Days.map((date) => {
      const dayDeliveries = deliveries.filter((d) => d.status === "completed" && d.completedAt?.startsWith(date))
      const earnings = dayDeliveries.reduce((sum, d) => sum + d.totalPrice, 0)

      return {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        earnings,
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portal...</p>
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
            <CardDescription>Please log in to access the employee portal</CardDescription>
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
          <div>
            <h1 className="text-2xl font-bold text-foreground">TruckFlow Driver Portal</h1>
            <p className="text-sm text-muted-foreground">Welcome, {session.name}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4">
          {(["overview", "record", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "overview" ? "Overview" : tab === "record" ? "Record Delivery" : "Delivery History"}
            </button>
          ))}
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
                  <MapPin className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
                  <p className="text-xs text-muted-foreground">{stats.completedDeliveries} completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">from deliveries</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Profit Share</CardTitle>
                  <TrendingUp className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">${stats.totalProfit.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">profit contribution</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Account ID</CardTitle>
                  <Clock className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{session.userId}</div>
                  <p className="text-xs text-muted-foreground">employee account</p>
                </CardContent>
              </Card>
            </div>

            {/* Earnings Trend */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Earnings Trend</CardTitle>
                <CardDescription>Last 7 days earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getEarningsTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                    <Legend />
                    <Line type="monotone" dataKey="earnings" stroke="var(--accent)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Profile Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="font-semibold text-foreground">{session.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-semibold text-foreground">{session.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                    <p className="font-semibold text-foreground">{session.userId}</p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support & Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    View Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Report an Issue
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    View FAQ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Record Delivery Tab */}
        {activeTab === "record" && (
          <div className="max-w-2xl">
            {session && (
              <DeliveryForm
                employeeId={session.userId}
                employeeName={session.name}
                materials={materials}
                onDeliveryCreated={handleDeliveryCreated}
              />
            )}
          </div>
        )}

        {/* Delivery History Tab */}
        {activeTab === "history" && (
          <Card>
            <CardHeader>
              <CardTitle>Your Delivery History</CardTitle>
              <CardDescription>All your recorded deliveries</CardDescription>
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
                          <th className="text-left py-2 px-2 font-semibold">Material</th>
                          <th className="text-left py-2 px-2 font-semibold">Qty</th>
                          <th className="text-left py-2 px-2 font-semibold">Customer</th>
                          <th className="text-left py-2 px-2 font-semibold">Location</th>
                          <th className="text-left py-2 px-2 font-semibold">Earnings</th>
                          <th className="text-left py-2 px-2 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveries.map((delivery) => (
                          <tr key={delivery.id} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-2 px-2">{delivery.materialName}</td>
                            <td className="py-2 px-2">{delivery.quantity}</td>
                            <td className="py-2 px-2">{delivery.customer}</td>
                            <td className="py-2 px-2 text-xs">{delivery.deliveryLocation}</td>
                            <td className="py-2 px-2 font-semibold text-accent">${delivery.totalPrice.toFixed(2)}</td>
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
      </main>
    </div>
  )
}
