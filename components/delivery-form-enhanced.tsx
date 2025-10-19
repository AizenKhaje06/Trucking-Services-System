"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, Truck, MapPin, Package } from "lucide-react"

interface DeliveryFormEnhancedProps {
  spreadsheetId: string
  employeeId: string
  onSuccess?: () => void
}

export function DeliveryFormEnhanced({ spreadsheetId, employeeId, onSuccess }: DeliveryFormEnhancedProps) {
  const [trucks, setTrucks] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    truckId: "",
    material: "",
    quantity: "",
    location: "",
    buyer: "",
    cost: "",
    sellingPrice: "",
  })

  const [profit, setProfit] = useState(0)

  useEffect(() => {
    loadTrucksAndMaterials()
  }, [])

  useEffect(() => {
    if (formData.cost && formData.sellingPrice) {
      const calculatedProfit = Number(formData.sellingPrice) - Number(formData.cost)
      setProfit(Math.round(calculatedProfit * 100) / 100)
    } else {
      setProfit(0)
    }
  }, [formData.cost, formData.sellingPrice])

  const loadTrucksAndMaterials = async () => {
    try {
      setLoading(true)

      // Load trucks
      const trucksResponse = await fetch("/api/trucks/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId }),
      })

      if (trucksResponse.ok) {
        const trucksData = await trucksResponse.json()
        // Filter only active trucks
        const activeTrucks = (trucksData.trucks || []).filter((t: any) => t.Status === "active")
        setTrucks(activeTrucks)
      }

      // Load materials
      const materialsResponse = await fetch("/api/sheets/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId, range: "Materials!A:D" }),
      })

      if (materialsResponse.ok) {
        const materialsData = await materialsResponse.json()
        setMaterials(materialsData.data || [])
      }
    } catch (err) {
      setError("Failed to load trucks and materials")
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (!formData.truckId) errors.push("Truck selection is required")
    if (!formData.material) errors.push("Material selection is required")
    if (!formData.quantity || Number(formData.quantity) <= 0) errors.push("Quantity must be greater than 0")
    if (!formData.location?.trim()) errors.push("Delivery location is required")
    if (!formData.buyer?.trim()) errors.push("Buyer/Customer name is required")
    if (formData.cost === "" || Number(formData.cost) < 0) errors.push("Cost must be a valid number")
    if (formData.sellingPrice === "" || Number(formData.sellingPrice) < 0)
      errors.push("Selling price must be a valid number")

    return { valid: errors.length === 0, errors }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const validation = validateForm()
    if (!validation.valid) {
      setError(validation.errors.join(", "))
      return
    }

    try {
      setLoading(true)

      // Check if truck is still active
      const selectedTruck = trucks.find((t) => t.Truck_ID === formData.truckId)
      if (!selectedTruck || selectedTruck.Status !== "active") {
        setError("Selected truck is not active. Please choose another truck.")
        return
      }

      const response = await fetch("/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadsheetId,
          transaction: {
            employee: employeeId,
            truckId: formData.truckId,
            material: formData.material,
            quantity: Number(formData.quantity),
            location: formData.location,
            buyer: formData.buyer,
            cost: Number(formData.cost),
            sellingPrice: Number(formData.sellingPrice),
          },
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Delivery recorded successfully! Transaction ID: ${data.txnId}`)
        setFormData({
          truckId: "",
          material: "",
          quantity: "",
          location: "",
          buyer: "",
          cost: "",
          sellingPrice: "",
        })
        setProfit(0)

        setTimeout(() => {
          onSuccess?.()
        }, 1500)
      } else {
        setError(data.message || "Failed to record delivery")
      }
    } catch (err) {
      setError("Error recording delivery")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-accent" />
          Record New Delivery
        </CardTitle>
        <CardDescription>Enter delivery details to record a new transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Truck Selection */}
          <div className="space-y-2">
            <Label htmlFor="truck" className="flex items-center gap-2 font-semibold">
              <Truck className="w-4 h-4 text-accent" />
              Select Truck
            </Label>
            <Select value={formData.truckId} onValueChange={(value) => setFormData({ ...formData, truckId: value })}>
              <SelectTrigger id="truck" disabled={loading || trucks.length === 0}>
                <SelectValue placeholder={trucks.length === 0 ? "No active trucks available" : "Select a truck"} />
              </SelectTrigger>
              <SelectContent>
                {trucks.map((truck: any) => (
                  <SelectItem key={truck.Truck_ID} value={truck.Truck_ID}>
                    {truck.Truck_ID} - {truck.Plate_No} ({truck.Driver})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Material Selection */}
          <div className="space-y-2">
            <Label htmlFor="material" className="font-semibold">
              Material Type
            </Label>
            <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
              <SelectTrigger id="material" disabled={loading || materials.length === 0}>
                <SelectValue placeholder={materials.length === 0 ? "No materials available" : "Select material"} />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material: any, index: number) => (
                  <SelectItem key={index} value={material.Material_Name || ""}>
                    {material.Material_Name} - ${material.Price_Per_Unit}/unit
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="font-semibold">
              Quantity (units)
            </Label>
            <Input
              id="quantity"
              type="number"
              placeholder="e.g., 5"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              disabled={loading}
              min="0"
              step="0.01"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2 font-semibold">
              <MapPin className="w-4 h-4 text-accent" />
              Delivery Location
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., 123 Main St, City, State"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Buyer/Customer */}
          <div className="space-y-2">
            <Label htmlFor="buyer" className="font-semibold">
              Buyer/Customer Name
            </Label>
            <Input
              id="buyer"
              type="text"
              placeholder="e.g., ABC Construction"
              value={formData.buyer}
              onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
              disabled={loading}
            />
          </div>

          {/* Cost and Selling Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost" className="font-semibold">
                Cost ($)
              </Label>
              <Input
                id="cost"
                type="number"
                placeholder="0.00"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                disabled={loading}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice" className="font-semibold">
                Selling Price ($)
              </Label>
              <Input
                id="sellingPrice"
                type="number"
                placeholder="0.00"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                disabled={loading}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Profit Display */}
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Estimated Profit:</span>
              <span className={`text-lg font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                ${profit.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || trucks.length === 0 || materials.length === 0}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 h-10"
          >
            {loading ? "Recording..." : "Record Delivery"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
