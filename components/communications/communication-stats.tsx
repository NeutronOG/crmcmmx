"use client"

import { Card } from "@/components/ui/card"
import { Mail, Send, Eye, MousePointerClick, TrendingUp, Clock } from "lucide-react"

const stats = [
  {
    label: "Emails Enviados",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: Send,
    color: "satin-blue",
  },
  {
    label: "Tasa de Apertura",
    value: "68.4%",
    change: "+5.2%",
    trend: "up",
    icon: Eye,
    color: "satin-green",
  },
  {
    label: "Tasa de Click",
    value: "24.8%",
    change: "+3.1%",
    trend: "up",
    icon: MousePointerClick,
    color: "satin-purple",
  },
  {
    label: "Respuestas",
    value: "412",
    change: "+8.7%",
    trend: "up",
    icon: Mail,
    color: "satin-yellow",
  },
  {
    label: "Secuencias Activas",
    value: "24",
    change: "+2",
    trend: "up",
    icon: TrendingUp,
    color: "satin-pink",
  },
  {
    label: "Promedio Respuesta",
    value: "2.4h",
    change: "-0.5h",
    trend: "up",
    icon: Clock,
    color: "satin-cyan",
  },
]

export function CommunicationStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="glass-card p-5 rounded-xl hover:scale-105 transition-all duration-300 group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg bg-background/50 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-medium ${stat.trend === "up" ? "satin-green" : "satin-red"}`}>
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
