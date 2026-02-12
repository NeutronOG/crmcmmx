"use client"

import { Card } from "@/components/ui/card"
import { DollarSign, FileText, Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react"

const stats = [
  {
    label: "Facturado Este Mes",
    value: "$125,430",
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
    color: "satin-green",
    bgColor: "satin-green-bg",
  },
  {
    label: "Facturas Emitidas",
    value: "42",
    change: "+5",
    trend: "up",
    icon: FileText,
    color: "satin-blue",
    bgColor: "satin-blue-bg",
  },
  {
    label: "Pendientes de Pago",
    value: "$48,200",
    change: "12 facturas",
    trend: "neutral",
    icon: Clock,
    color: "satin-yellow",
    bgColor: "satin-yellow-bg",
  },
  {
    label: "Pagadas",
    value: "$77,230",
    change: "30 facturas",
    trend: "up",
    icon: CheckCircle2,
    color: "satin-green",
    bgColor: "satin-green-bg",
  },
  {
    label: "Vencidas",
    value: "$8,500",
    change: "3 facturas",
    trend: "down",
    icon: AlertCircle,
    color: "satin-red",
    bgColor: "satin-red-bg",
  },
  {
    label: "Tasa de Cobro",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    icon: TrendingUp,
    color: "satin-cyan",
    bgColor: "satin-cyan-bg",
  },
]

export function InvoicesOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="glass-card p-5 rounded-xl hover:scale-105 transition-all duration-300 group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span
                className={`text-xs font-medium ${
                  stat.trend === "up"
                    ? "satin-green"
                    : stat.trend === "down"
                      ? "satin-red"
                      : "text-muted-foreground"
                }`}
              >
                {stat.change}
              </span>
            </div>

            <div>
              <p className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
