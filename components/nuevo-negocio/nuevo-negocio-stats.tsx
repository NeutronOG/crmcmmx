"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Briefcase, Target, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { getLeads } from "@/lib/store"

export function NuevoNegocioStats() {
  const [stats, setStats] = useState([
    { title: "Oportunidades Activas", value: "0", icon: Target, color: "from-[oklch(0.68_0.10_245)] to-[oklch(0.55_0.12_245)]" },
    { title: "En Negociación", value: "0", icon: Briefcase, color: "from-[oklch(0.68_0.12_300)] to-[oklch(0.52_0.12_350)]" },
    { title: "Valor Pipeline", value: "$0", icon: DollarSign, color: "from-[oklch(0.72_0.10_155)] to-[oklch(0.52_0.14_165)]" },
    { title: "Tasa de Conversión", value: "0%", icon: TrendingUp, color: "from-[oklch(0.74_0.11_55)] to-[oklch(0.76_0.10_70)]" },
  ])

  useEffect(() => {
    getLeads().then(leads => {
      const activos = leads.filter(l => !["Ganado", "Perdido"].includes(l.estado)).length
      const negociacion = leads.filter(l => l.estado === "Negociación").length
      const pipeline = leads.filter(l => !["Ganado", "Perdido"].includes(l.estado)).reduce((s, l) => s + l.valorEstimado, 0)
      const ganados = leads.filter(l => l.estado === "Ganado").length
      const conversion = leads.length > 0 ? Math.round((ganados / leads.length) * 100) : 0
      setStats([
        { title: "Oportunidades Activas", value: activos.toString(), icon: Target, color: "from-[oklch(0.68_0.10_245)] to-[oklch(0.55_0.12_245)]" },
        { title: "En Negociación", value: negociacion.toString(), icon: Briefcase, color: "from-[oklch(0.68_0.12_300)] to-[oklch(0.52_0.12_350)]" },
        { title: "Valor Pipeline", value: `$${pipeline.toLocaleString()}`, icon: DollarSign, color: "from-[oklch(0.72_0.10_155)] to-[oklch(0.52_0.14_165)]" },
        { title: "Tasa de Conversión", value: `${conversion}%`, icon: TrendingUp, color: "from-[oklch(0.74_0.11_55)] to-[oklch(0.76_0.10_70)]" },
      ])
    })
  }, [])

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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
