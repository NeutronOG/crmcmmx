"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, FileText, CheckCircle, Clock, XCircle } from "lucide-react"

export function CotizacionesStats() {
  const stats = [
    {
      title: "Cotizaciones Enviadas",
      value: "0",
      change: "—",
      icon: FileText,
      color: "from-[oklch(0.68_0.10_245)] to-[oklch(0.55_0.12_245)]",
    },
    {
      title: "Aprobadas",
      value: "0",
      change: "—",
      icon: CheckCircle,
      color: "from-[oklch(0.72_0.10_155)] to-[oklch(0.52_0.14_165)]",
    },
    {
      title: "Pendientes",
      value: "0",
      change: "—",
      icon: Clock,
      color: "from-[oklch(0.76_0.10_70)] to-[oklch(0.74_0.11_55)]",
    },
    {
      title: "Rechazadas",
      value: "0",
      change: "—",
      icon: XCircle,
      color: "from-[oklch(0.68_0.12_18)] to-[oklch(0.70_0.10_350)]",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="glass border-white/10 hover:border-white/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs flex items-center gap-1 mt-1 ${stat.change.startsWith('+') ? 'satin-green' : 'satin-red'}`}>
              <TrendingUp className="h-3 w-3" />
              {stat.change} vs mes anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
