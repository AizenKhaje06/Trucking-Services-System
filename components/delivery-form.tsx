// Delivery recording form component for employees

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle } from "lucide-react"
import type { Material } from "@/lib/materials"

interface DeliveryFormProps {
  employeeId: string
  employeeName: string
  materials: Material[]
  onDeliveryCreated?: () => void
}

export function DeliveryForm({ employeeId, employeeName, materials, onDeliveryCreated }: DeliveryFormProps) {
  const [formData, setFormData] = useState({
    materialId: "",
    quantity: "",
    truckId: "",
    truckName: "",
    customer: "",
    deliveryLocation: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)

  const trucks = [
    { id: "truck_001", name: "Truck #1" },
    { id: "truck_002", name: "Truck #2" },
    { id: "truck_003", name: "Truck #3" },
  ]

  const handleMaterialChange = (materialId: string) => {
    const material = materials.find((m) => m.id === materialId)
    setSelectedMaterial(material || null)
    setFormData({ ...formData, materialId })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (
      !formData.materialId ||
      !formData.quantity ||
      !formData.truckId ||
      !formData.customer ||
      !formData.deliveryLocation
    ) {
      setError("Please fill in all fields")
      return
    }

    if (!selectedMaterial) {
      setError("Invalid material selected")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/deliveries/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          employeeName,
          materialId: formData.materialId,
          materialName: selectedMaterial.name,
          quantity: formData.quantity,
          truckId: formData.truckId,
          truckName: formData.truckName,
          customer: formData.customer,
          deliveryLocation: formData.deliveryLocation,
          pricePerUnit: selectedMaterial.pricePerUnit,
          costPerUnit: selectedMaterial.costPerUnit,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to record delivery")
        setLoading(false)
        return
      }

      setSuccess("Delivery recorded successfully!")
      setFormData({
        materialId: "",
        quantity: "",
        truckId: "",
        truckName: "",
        customer: "",
        deliveryLocation: "",
      })
      setSelectedMaterial(null)
      onDeliveryCreated?.()

      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Record New Delivery</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material">Material Type</Label>
              <Select value={formData.materialId} onValueChange={handleMaterialChange}>
                <SelectTrigger id="material">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity ({selectedMaterial?.unit === "cubic_meter" ? "m³" : "loads"})</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0.0"
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="truck">Truck</Label>
              <Select
                value={formData.truckId}
                onValueChange={(value) => {
                  const truck = trucks.find((t) => t.id === value)
                  setFormData({
                    ...formData,
                    truckId: value,
                    truckName: truck?.name || "",
                  })
                }}
              >
                <SelectTrigger id="truck">
                  <SelectValue placeholder="Select truck" />
                </SelectTrigger>
                <SelectContent>
                  {trucks.map((truck) => (
                    <SelectItem key={truck.id} value={truck.id}>
                      {truck.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder="Customer name"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Delivery Location</Label>
            <Input
              id="location"
              value={formData.deliveryLocation}
              onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
              placeholder="e.g., 123 Main St, City"
              disabled={loading}
            />
          </div>

          {selectedMaterial && (
            <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
              <p className="text-sm font-semibold">Profit Estimate</p>
              <p className="text-sm text-muted-foreground">
                {selectedMaterial.name}: ${(selectedMaterial.pricePerUnit - selectedMaterial.costPerUnit).toFixed(2)}
                /unit
              </p>
              {formData.quantity && (
                <p className="text-sm font-semibold text-accent">
                  Total Profit: $
                  {(
                    (selectedMaterial.pricePerUnit - selectedMaterial.costPerUnit) *
                    Number.parseFloat(formData.quantity)
                  ).toFixed(2)}
                </p>
              )}
            </div>
          )}

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

          <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90">
            {loading ? "Recording..." : "Record Delivery"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
