"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, Plus } from "lucide-react"
import type { Expense } from "@/lib/expenses"

interface ExpenseManagerProps {
  expenses: Expense[]
  trucks: any[]
  onExpenseCreated?: () => void
}

export function ExpenseManager({ expenses, trucks, onExpenseCreated }: ExpenseManagerProps) {
  const [showForm, setShowForm] = useState(false)
  const [truckId, setTruckId] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<"fuel" | "maintenance" | "toll" | "labor" | "other">("fuel")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!truckId || !description || !amount) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/expenses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
          truckId,
          description,
          amount: Number(amount),
          category,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to create expense")
        setLoading(false)
        return
      }

      setSuccess("Expense recorded successfully!")
      setTruckId("")
      setDescription("")
      setAmount("")
      setCategory("fuel")
      setShowForm(false)

      setTimeout(() => {
        setSuccess("")
        onExpenseCreated?.()
      }, 2000)
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  const categoryColors: Record<string, string> = {
    fuel: "bg-blue-100 text-blue-700",
    maintenance: "bg-orange-100 text-orange-700",
    toll: "bg-purple-100 text-purple-700",
    labor: "bg-green-100 text-green-700",
    other: "bg-gray-100 text-gray-700",
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
          <CardDescription>All recorded operational costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-accent">${totalExpenses.toFixed(2)}</div>
          <p className="text-sm text-muted-foreground mt-2">{expenses.length} expense records</p>
        </CardContent>
      </Card>

      {/* Add Expense Button */}
      <Button onClick={() => setShowForm(!showForm)} className="gap-2 bg-accent hover:bg-accent/90">
        <Plus className="w-4 h-4" />
        Record Expense
      </Button>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="truck">Truck ID</Label>
                  <Select value={truckId} onValueChange={setTruckId}>
                    <SelectTrigger id="truck">
                      <SelectValue placeholder="Select truck" />
                    </SelectTrigger>
                    <SelectContent>
                      {trucks.map((truck) => (
                        <SelectItem key={truck.id} value={truck.id}>
                          {truck.truckId} - {truck.plateNo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fuel">Fuel</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="toll">Toll Fees</SelectItem>
                      <SelectItem value="labor">Labor</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="e.g., Fuel refill at Shell"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {success}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1 bg-accent hover:bg-accent/90">
                  {loading ? "Recording..." : "Record Expense"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="bg-transparent">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
          <CardDescription>All recorded expenses</CardDescription>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No expenses recorded yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.map((expense) => (
                <div key={expense.expId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${categoryColors[expense.category]}`}>
                        {expense.category.toUpperCase()}
                      </span>
                      <p className="font-semibold text-sm">{expense.description}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {expense.truckId} • {expense.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">${expense.amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
