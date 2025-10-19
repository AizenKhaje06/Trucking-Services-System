"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Zap } from "lucide-react"

const phases = [
  {
    phase: "Phase 1",
    title: "Core System",
    quarter: "Q1 2025",
    status: "completed",
    features: [
      "Authentication & Sessions",
      "Material Management",
      "Delivery Recording",
      "Profit Calculations",
      "Reporting & Analytics",
    ],
  },
  {
    phase: "Phase 2",
    title: "Enhanced Operations",
    quarter: "Q2 2025",
    status: "planned",
    features: [
      "Printable Documents (Invoices, Waybills)",
      "Mobile Adaptation",
      "SMS Notifications",
      "Email Alerts",
      "Customer Notifications",
    ],
  },
  {
    phase: "Phase 3",
    title: "Advanced Management",
    quarter: "Q3 2025",
    status: "planned",
    features: ["Manager Role", "Predictive Analytics", "Route Optimization", "GPS Tracking", "Customer Portal"],
  },
  {
    phase: "Phase 4",
    title: "Enterprise Features",
    quarter: "Q4 2025",
    status: "planned",
    features: [
      "Multi-Company Support",
      "Two-Factor Authentication",
      "Audit Logging",
      "REST API",
      "Third-Party Integrations",
    ],
  },
  {
    phase: "Phase 5",
    title: "Scaling & Performance",
    quarter: "2026",
    status: "planned",
    features: ["Database Migration", "Caching Layer", "CDN Integration", "AI Assistant", "Automated Scheduling"],
  },
]

export function RoadmapViewer() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Product Roadmap</h2>
        <p className="text-muted-foreground">Planned features and improvements for TruckFlow across multiple phases</p>
      </div>

      <div className="grid gap-4">
        {phases.map((phase, index) => (
          <Card key={index} className="border-border/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={phase.status === "completed" ? "default" : "secondary"}
                      className={
                        phase.status === "completed"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {phase.status === "completed" ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {phase.status === "completed" ? "Completed" : "Planned"}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">
                    {phase.phase}: {phase.title}
                  </CardTitle>
                  <CardDescription>{phase.quarter}</CardDescription>
                </div>
                <Zap className="w-5 h-5 text-accent flex-shrink-0" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {phase.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-accent/30 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-lg">How to Request Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Have a feature idea? We'd love to hear it!</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Create an issue on GitHub</li>
            <li>Vote on existing feature requests</li>
            <li>Share feedback with the team</li>
            <li>Contribute to development</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
