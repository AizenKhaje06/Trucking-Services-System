"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Truck, Plus, AlertCircle, CheckCircle } from "lucide-react"

interface TruckManagerProps {
  spreadsheetId: string
}

export function TruckManager({ spreadsheetId }: TruckManagerProps) {
  const [trucks, setTrucks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    truckId: "",
    plateNo: "",
    capacity: "",
    driver: "",
    status: "active",
  })

  useEffect(() => {
    loadTrucks()
  }, [])

  const loadTrucks = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/trucks/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId }),
      })

      const data = await response.json()
      if (response.ok) {
        setTrucks(data.trucks || [])
      } else {
        setError(data.message || "Failed to load trucks")
      }
    } catch (err) {
      setError("Error loading trucks")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      setLoading(true)
      const response = await fetch("/api/trucks/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadsheetId,
          truck: {
            ...formData,
            capacity: Number(formData.capacity),
          },
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess("Truck added successfully!")
        setFormData({ truckId: "", plateNo: "", capacity: "", driver: "", status: "active" })
        setShowForm(false)
        await loadTrucks()
      } else {
        setError(data.message || "Failed to add truck")
      }
    } catch (err) {
      setError("Error adding truck")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-accent p-2 rounded-lg">
            <Truck className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Fleet Management</h2>
            <p className="text-sm text-muted-foreground">Manage your truck fleet</p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Truck
        </Button>
      </div>

      {/* Add Truck Form */}
      {showForm && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Register New Truck</CardTitle>
            <CardDescription>Add a new truck to your fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="truckId">Truck ID</Label>
                  <Input
                    id="truckId"
                    placeholder="e.g., TRK001"
                    value={formData.truckId}
                    onChange={(e) => setFormData({ ...formData, truckId: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plateNo">Plate Number</Label>
                  <Input
                    id="plateNo"
                    placeholder="e.g., ABC-1234"
                    value={formData.plateNo}
                    onChange={(e) => setFormData({ ...formData, plateNo: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (tons)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="e.g., 10"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driver">Driver Name</Label>
                  <Input
                    id="driver"
                    placeholder="e.g., John Doe"
                    value={formData.driver}
                    onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
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
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {loading ? "Adding..." : "Add Truck"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Trucks Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Fleet Inventory</CardTitle>
          <CardDescription>{trucks.length} trucks registered</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && !trucks.length ? (
            <div className="text-center py-8 text-muted-foreground">Loading trucks...</div>
          ) : trucks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No trucks registered yet</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Truck ID</TableHead>
                    <TableHead>Plate No</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trucks.map((truck: any, index: number) => (
                    <TableRow key={index} className="border-border/50">
                      <TableCell className="font-semibold text-foreground">{truck.Truck_ID}</TableCell>
                      <TableCell>{truck.Plate_No}</TableCell>
                      <TableCell>{truck.Capacity} tons</TableCell>
                      <TableCell>{truck.Driver}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            truck.Status === "active"
                              ? "bg-green-100 text-green-700"
                              : truck.Status === "maintenance"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {truck.Status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
