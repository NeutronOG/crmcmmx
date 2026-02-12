"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingDown, AlertCircle, X } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "Tasa de conversión por debajo del objetivo",
    description: "La tasa de conversión de leads ha caído a 28.4%, por debajo del objetivo de 30%",
    metric: "Conversión de Leads",
    threshold: "30%",
    current: "28.4%",
    impact: "high",
  },
  {
    id: 2,
    type: "critical",
    title: "ROI de campaña de Facebook bajo",
    description: "La campaña de RetailMart tiene un ROI de 120%, por debajo del mínimo de 200%",
    metric: "ROI Campaña Facebook",
    threshold: "200%",
    current: "120%",
    impact: "critical",
  },
  {
    id: 3,
    type: "warning",
    title: "Tiempo de respuesta aumentando",
    description: "El tiempo promedio de respuesta a leads ha aumentado a 4.2 horas",
    metric: "Tiempo de Respuesta",
    threshold: "2h",
    current: "4.2h",
    impact: "medium",
  },
]

export function KPIAlerts() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 satin-yellow" />
          <h2 className="text-2xl font-bold">Alertas de KPIs</h2>
          <Badge variant="destructive" className="rounded-full">
            {alerts.length}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {alerts.map((alert) => (
          <Card key={alert.id} className="glass-card p-5 rounded-xl hover:scale-[1.02] transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      alert.type === "critical" ? "satin-red-bg satin-red" : "satin-yellow-bg satin-yellow"
                    }`}
                  >
                    {alert.type === "critical" ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Badge
                      variant={alert.type === "critical" ? "destructive" : "secondary"}
                      className="rounded-full mb-2"
                    >
                      {alert.type === "critical" ? "Crítico" : "Advertencia"}
                    </Badge>
                  </div>
                </div>

                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">{alert.title}</h3>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/40">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Objetivo</p>
                  <p className="text-sm font-semibold satin-green">{alert.threshold}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Actual</p>
                  <p
                    className={`text-sm font-semibold ${
                      alert.type === "critical" ? "satin-red" : "satin-yellow"
                    }`}
                  >
                    {alert.current}
                  </p>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Ver Detalles
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
