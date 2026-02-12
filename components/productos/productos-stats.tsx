"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Monitor, Image, Package } from "lucide-react"
import { useEffect, useState } from "react"
import { getProyectos, getTareas } from "@/lib/store"

export function ProductosStats() {
  const [stats, setStats] = useState([
    { title: "Proyectos de Diseño", value: "0", icon: Palette, color: "from-[oklch(0.70_0.10_350)] to-[oklch(0.68_0.12_18)]" },
    { title: "Tareas Activas", value: "0", icon: Monitor, color: "from-[oklch(0.68_0.10_245)] to-[oklch(0.48_0.14_275)]" },
    { title: "Evidencias Subidas", value: "0", icon: Image, color: "from-[oklch(0.68_0.12_300)] to-[oklch(0.52_0.14_300)]" },
    { title: "Completados", value: "0", icon: Package, color: "from-[oklch(0.72_0.10_155)] to-[oklch(0.55_0.10_200)]" },
  ])

  useEffect(() => {
    Promise.all([getProyectos(), getTareas()]).then(([p, t]) => {
      const diseño = p.filter(pr => pr.estado !== "Completado").length
      const tareasActivas = t.filter(ta => ta.estado !== "Completada").length
      const evidencias = t.reduce((sum, ta) => sum + (ta.evidencias?.length || 0), 0)
      const completados = p.filter(pr => pr.estado === "Completado").length
      setStats([
        { title: "Proyectos Activos", value: diseño.toString(), icon: Palette, color: "from-[oklch(0.70_0.10_350)] to-[oklch(0.68_0.12_18)]" },
        { title: "Tareas Activas", value: tareasActivas.toString(), icon: Monitor, color: "from-[oklch(0.68_0.10_245)] to-[oklch(0.48_0.14_275)]" },
        { title: "Evidencias Subidas", value: evidencias.toString(), icon: Image, color: "from-[oklch(0.68_0.12_300)] to-[oklch(0.52_0.14_300)]" },
        { title: "Completados", value: completados.toString(), icon: Package, color: "from-[oklch(0.72_0.10_155)] to-[oklch(0.55_0.10_200)]" },
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
