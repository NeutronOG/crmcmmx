"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, CheckCircle, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { getProyectos, getTareas } from "@/lib/store"
import { getUsuarios } from "@/lib/auth"

export function ResponsablesStats() {
  const [stats, setStats] = useState([
    { title: "Responsables Activos", value: "0", icon: Users, color: "from-[oklch(0.68_0.10_245)] to-[oklch(0.55_0.12_245)]" },
    { title: "Proyectos Asignados", value: "0", icon: Briefcase, color: "from-[oklch(0.68_0.12_300)] to-[oklch(0.52_0.12_350)]" },
    { title: "Tareas Completadas", value: "0", icon: CheckCircle, color: "from-[oklch(0.72_0.10_155)] to-[oklch(0.52_0.14_165)]" },
    { title: "Tareas Pendientes", value: "0", icon: Clock, color: "from-[oklch(0.76_0.10_70)] to-[oklch(0.74_0.11_55)]" },
  ])

  useEffect(() => {
    Promise.all([getUsuarios(), getProyectos(), getTareas()]).then(([u, p, t]) => {
      const activos = u.filter(usr => usr.rol !== "admin").length
      const asignados = p.filter(pr => pr.responsable).length
      const completadas = t.filter(ta => ta.estado === "Completada").length
      const pendientes = t.filter(ta => ta.estado !== "Completada").length
      setStats([
        { title: "Responsables Activos", value: activos.toString(), icon: Users, color: "from-[oklch(0.68_0.10_245)] to-[oklch(0.55_0.12_245)]" },
        { title: "Proyectos Asignados", value: asignados.toString(), icon: Briefcase, color: "from-[oklch(0.68_0.12_300)] to-[oklch(0.52_0.12_350)]" },
        { title: "Tareas Completadas", value: completadas.toString(), icon: CheckCircle, color: "from-[oklch(0.72_0.10_155)] to-[oklch(0.52_0.14_165)]" },
        { title: "Tareas Pendientes", value: pendientes.toString(), icon: Clock, color: "from-[oklch(0.76_0.10_70)] to-[oklch(0.74_0.11_55)]" },
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
