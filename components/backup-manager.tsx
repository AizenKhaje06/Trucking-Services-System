"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Database, AlertCircle, CheckCircle } from "lucide-react"
import { downloadFile } from "@/lib/backup-export"

export function BackupManager() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleExportBackup = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/backup/export", { method: "POST" })
      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Failed to export backup")
        setLoading(false)
        return
      }

      // Download Excel file
      const timestamp = new Date(data.timestamp).toISOString().split("T")[0]
      downloadFile(data.excelContent, `truckflow-backup-${timestamp}.xls`, "application/vnd.ms-excel")

      setSuccess("Backup exported successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export backup")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-accent" />
          Backup & Recovery
        </CardTitle>
        <CardDescription>Export your data for backup and recovery purposes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <p className="text-sm font-semibold text-foreground">Backup Strategy</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Google Sheets acts as your live database with automatic version history</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Export backups regularly to Excel for offline storage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>All data is automatically recovered on system redeploy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">•</span>
              <span>Enable Google Sheets version history for rollback capability</span>
            </li>
          </ul>
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

        <Button
          onClick={handleExportBackup}
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Download className="w-4 h-4 mr-2" />
          {loading ? "Exporting..." : "Export Backup to Excel"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Backup includes all transactions, expenses, trucks, materials, and employee data
        </p>
      </CardContent>
    </Card>
  )
}
