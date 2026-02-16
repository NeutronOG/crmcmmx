"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Users, Briefcase, Target, BarChart3, Clock } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { getClientes, getProyectos, getLeads, getIngresos } from "@/lib/store"

export function ReportsOverview() {
  const { isAdmin } = useAuth()
  const [data, setData] = useState({
    ingresos: 0,
    clientes: 0,
    proyectos: 0,
    conversion: 0,
    tiempoEntrega: 0,
  })

  useEffect(() => {
    Promise.all([getClientes(), getProyectos(), getLeads(), getIngresos()]).then(([c, p, l, i]) => {
      const activos = p.filter(pr => pr.estado !== "Completado" && pr.estado !== "Pausado").length
      const ganados = l.filter(ld => ld.estado === "Ganado").length
      const totalLeads = l.length
      const conversion = totalLeads > 0 ? Math.round((ganados / totalLeads) * 100) : 0
      const totalIngresos = i.reduce((sum, ing) => sum + ing.monto, 0)
      
      // Calculate average delivery time from completed projects
      const completados = p.filter(pr => pr.estado === "Completado" && pr.fechaInicio && pr.fechaEntrega)
      let avgDays = 0
      if (completados.length > 0) {
        const totalDays = completados.reduce((sum, pr) => {
          const start = new Date(pr.fechaInicio!).getTime()
          const end = new Date(pr.fechaEntrega!).getTime()
          return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        }, 0)
        avgDays = Math.round(totalDays / completados.length)
      }

      setData({
        ingresos: totalIngresos,
        clientes: c.length,
        proyectos: activos,
        conversion,
        tiempoEntrega: avgDays,
      })
    })
  }, [])

  const allMetrics = [
    {
      label: "Ingresos Totales",
      value: `$${data.ingresos.toLocaleString()}`,
      change: "",
      trend: "up" as const,
      icon: DollarSign,
      color: "satin-green",
      bgColor: "satin-green-bg",
      adminOnly: true,
    },
    {
      label: "Nuevos Clientes",
      value: data.clientes.toString(),
      change: "",
      trend: "up" as const,
      icon: Users,
      color: "satin-blue",
      bgColor: "satin-blue-bg",
      adminOnly: false,
    },
    {
      label: "Proyectos Activos",
      value: data.proyectos.toString(),
      change: "",
      trend: "up" as const,
      icon: Briefcase,
      color: "satin-purple",
      bgColor: "satin-purple-bg",
      adminOnly: false,
    },
    {
      label: "Tasa de Conversión",
      value: `${data.conversion}%`,
      change: "",
      trend: data.conversion >= 30 ? "up" as const : "down" as const,
      icon: Target,
      color: "satin-yellow",
      bgColor: "satin-yellow-bg",
      adminOnly: false,
    },
    {
      label: "Tiempo de Entrega",
      value: data.tiempoEntrega > 0 ? `${data.tiempoEntrega} días` : "N/A",
      change: "",
      trend: "up" as const,
      icon: Clock,
      color: "satin-cyan",
      bgColor: "satin-cyan-bg",
      adminOnly: false,
    },
  ]

  const metrics = isAdmin ? allMetrics : allMetrics.filter(m => !m.adminOnly)
  const gridCols = isAdmin ? "xl:grid-cols-5" : "xl:grid-cols-4"
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gridCols} gap-4`}>
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
