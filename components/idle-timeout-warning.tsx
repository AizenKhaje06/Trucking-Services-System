"use client"

import { AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface IdleTimeoutWarningProps {
  isVisible: boolean
  minutesRemaining: number
  onExtend: () => void
  onLogout: () => void
}

export function IdleTimeoutWarning({ isVisible, minutesRemaining, onExtend, onLogout }: IdleTimeoutWarningProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-destructive/50 bg-destructive/5">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />
            <h2 className="text-lg font-semibold text-foreground">Session Expiring Soon</h2>
          </div>

          <p className="text-sm text-muted-foreground">
            Your session will expire due to inactivity in{" "}
            <span className="font-semibold text-destructive">
              {minutesRemaining} minute{minutesRemaining !== 1 ? "s" : ""}
            </span>
            .
          </p>

          <div className="bg-muted/50 p-3 rounded-lg flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Click "Continue Session" to stay logged in or you will be automatically logged out.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={onExtend} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
              Continue Session
            </Button>
            <Button onClick={onLogout} variant="outline" className="flex-1 bg-transparent">
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
