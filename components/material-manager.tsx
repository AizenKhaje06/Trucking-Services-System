// Material management component for Owner dashboard

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit2, Trash2 } from "lucide-react"
import type { Material } from "@/lib/materials"

interface MaterialManagerProps {
  onMaterialsUpdate?: (materials: Material[]) => void
}

export function MaterialManager({ onMaterialsUpdate }: MaterialManagerProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    unit: "cubic_meter" as const,
    pricePerUnit: "",
    costPerUnit: "",
  })

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      const response = await fetch("/api/materials/list")
      const data = await response.json()
      if (data.success) {
        setMaterials(data.materials)
        onMaterialsUpdate?.(data.materials)
      }
    } catch (error) {
      console.error("Failed to fetch materials:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.pricePerUnit || !formData.costPerUnit) {
      alert("Please fill in all fields")
      return
    }

    try {
      const endpoint = editingId ? "/api/materials/update" : "/api/materials/create"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          ...formData,
        }),
      })

      const data = await response.json()
      if (data.success) {
        fetchMaterials()
        setFormData({ name: "", unit: "cubic_meter", pricePerUnit: "", costPerUnit: "" })
        setEditingId(null)
        setShowForm(false)
      }
    } catch (error) {
      console.error("Failed to save material:", error)
    }
  }

  const handleEdit = (material: Material) => {
    setFormData({
      name: material.name,
      unit: material.unit,
      pricePerUnit: material.pricePerUnit.toString(),
      costPerUnit: material.costPerUnit.toString(),
    })
    setEditingId(material.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setFormData({ name: "", unit: "cubic_meter", pricePerUnit: "", costPerUnit: "" })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Materials</h3>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} size="sm" className="gap-2 bg-accent hover:bg-accent/90">
            <Plus className="w-4 h-4" />
            Add Material
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="text-base">{editingId ? "Edit Material" : "Add New Material"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Material Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., 3/4 Gravel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        unit: value as "cubic_meter" | "truckload",
                      })
                    }
                  >
                    <SelectTrigger id="unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cubic_meter">Cubic Meter</SelectItem>
                      <SelectItem value="truckload">Truckload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price per Unit ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost per Unit ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90">
                  {editingId ? "Update" : "Create"} Material
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading materials...</p>
        ) : materials.length === 0 ? (
          <p className="text-muted-foreground text-sm">No materials defined yet</p>
        ) : (
          materials.map((material) => (
            <Card key={material.id} className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{material.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Selling: ${material.pricePerUnit.toFixed(2)}/{material.unit === "cubic_meter" ? "m³" : "load"} |
                      Cost: ${material.costPerUnit.toFixed(2)} | Profit: $
                      {(material.pricePerUnit - material.costPerUnit).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(material)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
