"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Briefcase, TrendingUp, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"
import { getClientes, getProyectos, getLeads, getIngresos } from "@/lib/store"

export function StatsCards() {
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState({ clientes: 0, proyectos: 0, conversion: 0, ingresos: 0 })

  useEffect(() => {
    setMounted(true)
    Promise.all([getClientes(), getProyectos(), getLeads(), getIngresos()]).then(([c, p, l, i]) => {
      const activos = p.filter(pr => pr.estado !== "Completado" && pr.estado !== "Pausado").length
      const ganados = l.filter(ld => ld.estado === "Ganado").length
      const totalLeads = l.length
      const conversion = totalLeads > 0 ? Math.round((ganados / totalLeads) * 100) : 0
      const now = new Date()
      const ingresosMes = i.filter(ing => ing.mes === (now.getMonth() + 1) && ing.año === now.getFullYear()).reduce((sum, ing) => sum + ing.monto, 0)
      setData({ clientes: c.length, proyectos: activos, conversion, ingresos: ingresosMes })
    })
  }, [])

  const stats = [
    {
      label: "Total Clientes",
      value: data.clientes.toString(),
      change: "",
      icon: Users,
      positive: true,
      gradient: "from-[oklch(0.68_0.10_245)] to-[oklch(0.68_0.10_245_/_0.3)]",
    },
    {
      label: "Proyectos Activos",
      value: data.proyectos.toString(),
      change: "",
      icon: Briefcase,
      positive: true,
      gradient: "from-[oklch(0.68_0.12_300)] to-[oklch(0.68_0.12_300_/_0.3)]",
    },
    {
      label: "Tasa de Conversión",
      value: `${data.conversion}%`,
      change: "",
      icon: TrendingUp,
      positive: true,
      gradient: "from-[oklch(0.78_0.10_85)] to-[oklch(0.78_0.10_85_/_0.3)]",
    },
    {
      label: "Ingresos del Mes",
      value: `$${data.ingresos.toLocaleString()}`,
      change: "",
      icon: DollarSign,
      positive: true,
      gradient: "from-[oklch(0.72_0.10_155)] to-[oklch(0.72_0.10_155_/_0.3)]",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={index}
            className={`glass-intense border-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-black/30 transition-all duration-500 relative overflow-hidden group ${
              mounted ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-2 flex-1">
                  <p className="text-sm font-medium text-white/50">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tight text-white">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        stat.positive
                          ? "satin-green-bg satin-green border satin-green-border"
                          : "satin-red-bg satin-red border satin-red-border"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-white/30">este mes</span>
                  </div>
                </div>
                <div
                  className={`size-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/10`}
                >
                  <Icon className="size-8 text-white drop-shadow-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
