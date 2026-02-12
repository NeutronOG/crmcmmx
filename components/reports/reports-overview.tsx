"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Users, Briefcase, Target, BarChart3, Clock } from "lucide-react"

const metrics = [
  {
    label: "Ingresos Totales",
    value: "$125,430",
    change: "+18.2%",
    trend: "up",
    icon: DollarSign,
    color: "satin-green",
    bgColor: "satin-green-bg",
  },
  {
    label: "Nuevos Clientes",
    value: "24",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "satin-blue",
    bgColor: "satin-blue-bg",
  },
  {
    label: "Proyectos Activos",
    value: "47",
    change: "+8.3%",
    trend: "up",
    icon: Briefcase,
    color: "satin-purple",
    bgColor: "satin-purple-bg",
  },
  {
    label: "Tasa de Conversión",
    value: "32.4%",
    change: "+5.1%",
    trend: "up",
    icon: Target,
    color: "satin-yellow",
    bgColor: "satin-yellow-bg",
  },
  {
    label: "ROI Promedio",
    value: "285%",
    change: "+22.8%",
    trend: "up",
    icon: BarChart3,
    color: "satin-pink",
    bgColor: "satin-pink-bg",
  },
  {
    label: "Tiempo de Entrega",
    value: "14 días",
    change: "-2 días",
    trend: "up",
    icon: Clock,
    color: "satin-cyan",
    bgColor: "satin-cyan-bg",
  },
]

export function ReportsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className="glass-card p-5 rounded-xl hover:scale-105 transition-all duration-300 group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div className="flex items-center gap-1">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 satin-green" />
                ) : (
                  <TrendingDown className="h-4 w-4 satin-red" />
                )}
                <span className={`text-xs font-medium ${metric.trend === "up" ? "satin-green" : "satin-red"}`}>
                  {metric.change}
                </span>
              </div>
            </div>

            <div>
              <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{metric.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
