"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingDown, AlertCircle, X, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { getLeads, getProyectos } from "@/lib/store"

interface Alert {
  id: number
  type: "warning" | "critical"
  title: string
  description: string
  metric: string
  threshold: string
  current: string
  adminOnly: boolean
}

export function KPIAlerts() {
  const { isAdmin } = useAuth()
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    Promise.all([getLeads(), getProyectos()]).then(([leads, proyectos]) => {
      const generatedAlerts: Alert[] = []
      let alertId = 1

      // Check conversion rate (objective: 30%)
      const ganados = leads.filter(l => l.estado === "Ganado").length
      const totalLeads = leads.length
      const conversion = totalLeads > 0 ? Math.round((ganados / totalLeads) * 100) : 0
      
      if (totalLeads > 0 && conversion < 30) {
        generatedAlerts.push({
          id: alertId++,
          type: conversion < 15 ? "critical" : "warning",
          title: "Tasa de conversión por debajo del objetivo",
          description: `La tasa de conversión de leads es ${conversion}%, por debajo del objetivo de 30%`,
          metric: "Conversión de Leads",
          threshold: "30%",
          current: `${conversion}%`,
          adminOnly: false,
        })
      }

      // Check overdue projects
      const now = new Date()
      const overdue = proyectos.filter(p => {
        if (p.estado === "Completado" || !p.fechaEntrega) return false
        return new Date(p.fechaEntrega) < now
      })

      if (overdue.length > 0) {
        generatedAlerts.push({
          id: alertId++,
          type: overdue.length > 3 ? "critical" : "warning",
          title: `${overdue.length} proyecto(s) con fecha vencida`,
          description: `Hay ${overdue.length} proyecto(s) que han pasado su fecha de entrega`,
          metric: "Proyectos Vencidos",
          threshold: "0",
          current: overdue.length.toString(),
          adminOnly: false,
        })
      }

      // Check stalled leads (no contact in 7+ days)
      const stalledLeads = leads.filter(l => {
        if (l.estado === "Ganado" || l.estado === "Perdido") return false
        if (!l.ultimoContacto) return true
        const lastContact = new Date(l.ultimoContacto)
        const daysSince = Math.floor((now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24))
        return daysSince > 7
      })

      if (stalledLeads.length > 0) {
        generatedAlerts.push({
          id: alertId++,
          type: stalledLeads.length > 5 ? "critical" : "warning",
          title: `${stalledLeads.length} lead(s) sin contacto reciente`,
          description: `Hay ${stalledLeads.length} lead(s) sin contacto en más de 7 días`,
          metric: "Leads Estancados",
          threshold: "0",
          current: stalledLeads.length.toString(),
          adminOnly: false,
        })
      }

      setAlerts(generatedAlerts)
    })
  }, [])

  const visibleAlerts = isAdmin ? alerts : alerts.filter(a => !a.adminOnly)
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {visibleAlerts.length > 0 ? (
            <AlertTriangle className="h-6 w-6 satin-yellow" />
          ) : (
            <CheckCircle2 className="h-6 w-6 satin-green" />
          )}
          <h2 className="text-2xl font-bold">Alertas de KPIs</h2>
          {visibleAlerts.length > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {visibleAlerts.length}
            </Badge>
          )}
        </div>
      </div>

      {visibleAlerts.length === 0 ? (
        <Card className="glass-card p-8 rounded-xl text-center">
          <CheckCircle2 className="h-12 w-12 satin-green mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">¡Todo en orden!</h3>
          <p className="text-muted-foreground">No hay alertas de KPIs en este momento. Todos los indicadores están dentro de los objetivos.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleAlerts.map((alert) => (
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
      )}
    </div>
  )
}
