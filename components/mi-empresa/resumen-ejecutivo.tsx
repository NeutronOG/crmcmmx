"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Users, Briefcase, DollarSign, TrendingUp, Target, CheckCircle2 } from "lucide-react"
import { getClientes, getProyectos, getLeads, getTareas, getIngresos } from "@/lib/store"

export function ResumenEjecutivo() {
  const [data, setData] = useState({
    clientes: 0,
    proyectosActivos: 0,
    proyectosCompletados: 0,
    tareasCompletadas: 0,
    tareasTotales: 0,
    leadsGanados: 0,
    leadsTotales: 0,
    ingresosMes: 0,
  })

  useEffect(() => {
    Promise.all([getClientes(), getProyectos(), getLeads(), getTareas(), getIngresos()]).then(
      ([c, p, l, t, i]) => {
        const now = new Date()
        const ingresosMes = i
          .filter((ing) => ing.mes === now.getMonth() + 1 && ing.año === now.getFullYear())
          .reduce((sum, ing) => sum + ing.monto, 0)
        setData({
          clientes: c.length,
          proyectosActivos: p.filter((pr) => pr.estado !== "Completado" && pr.estado !== "Pausado").length,
          proyectosCompletados: p.filter((pr) => pr.estado === "Completado").length,
          tareasCompletadas: t.filter((ta) => ta.estado === "Completada").length,
          tareasTotales: t.length,
          leadsGanados: l.filter((ld) => ld.estado === "Ganado").length,
          leadsTotales: l.length,
          ingresosMes,
        })
      }
    )
  }, [])

  const conversion = data.leadsTotales > 0 ? Math.round((data.leadsGanados / data.leadsTotales) * 100) : 0
  const progreso = data.tareasTotales > 0 ? Math.round((data.tareasCompletadas / data.tareasTotales) * 100) : 0

  const metrics = [
    {
      label: "Clientes Totales",
      value: data.clientes.toString(),
      icon: Users,
      color: "satin-blue",
      bg: "satin-blue-bg",
    },
    {
      label: "Proyectos Activos",
      value: data.proyectosActivos.toString(),
      icon: Briefcase,
      color: "satin-purple",
      bg: "satin-purple-bg",
    },
    {
      label: "Ingresos del Mes",
      value: `$${data.ingresosMes.toLocaleString()}`,
      icon: DollarSign,
      color: "satin-green",
      bg: "satin-green-bg",
    },
    {
      label: "Tasa de Conversión",
      value: `${conversion}%`,
      icon: Target,
      color: "satin-yellow",
      bg: "satin-yellow-bg",
    },
    {
      label: "Progreso General",
      value: `${progreso}%`,
      icon: TrendingUp,
      color: "satin-cyan",
      bg: "satin-cyan-bg",
    },
    {
      label: "Completados",
      value: data.proyectosCompletados.toString(),
      icon: CheckCircle2,
      color: "satin-green",
      bg: "satin-green-bg",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className="glass-card p-5 rounded-xl hover:scale-105 transition-all duration-300">
            <div className="space-y-3">
              <div className={`p-3 rounded-xl ${m.bg} w-fit`}>
                <m.icon className={`h-5 w-5 ${m.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-card p-6 rounded-xl">
          <h3 className="font-semibold mb-4">Pipeline de Leads</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Leads totales</span>
              <span className="font-bold">{data.leadsTotales}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ganados</span>
              <span className="font-bold satin-green">{data.leadsGanados}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Conversión</span>
              <span className="font-bold satin-yellow">{conversion}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full satin-green-bg rounded-full transition-all duration-500"
                style={{ width: `${conversion}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 rounded-xl">
          <h3 className="font-semibold mb-4">Avance de Tareas</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total tareas</span>
              <span className="font-bold">{data.tareasTotales}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completadas</span>
              <span className="font-bold satin-green">{data.tareasCompletadas}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-bold satin-blue">{progreso}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full satin-blue-solid rounded-full transition-all duration-500"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
