"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Users, Percent, CreditCard } from "lucide-react"

export function NominaStats() {
  const stats = [
    {
      title: "Nómina Total",
      value: "$45,800",
      change: "+12%",
      icon: DollarSign,
      color: "from-[oklch(0.72_0.10_155)] to-[oklch(0.52_0.14_165)]",
    },
    {
      title: "Empleados Activos",
      value: "18",
      change: "+2",
      icon: Users,
      color: "from-[oklch(0.68_0.10_245)] to-[oklch(0.55_0.12_245)]",
    },
    {
      title: "Comisiones Pagadas",
      value: "$12,350",
      change: "+25%",
      icon: Percent,
      color: "from-[oklch(0.68_0.12_300)] to-[oklch(0.52_0.12_350)]",
    },
    {
      title: "Pagos Pendientes",
      value: "$8,200",
      change: "-15%",
      icon: CreditCard,
      color: "from-[oklch(0.76_0.10_70)] to-[oklch(0.74_0.11_55)]",
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
            <p className={`text-xs flex items-center gap-1 mt-1 ${stat.change.startsWith('+') || stat.change.startsWith('-') && stat.title === "Pagos Pendientes" ? 'satin-green' : 'satin-green'}`}>
              <TrendingUp className="h-3 w-3" />
              {stat.change} vs mes anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
