"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Star, ClipboardCheck, UserCheck } from "lucide-react"
import type { Creador, CreadorCalificacion } from "@/lib/store"

interface CreadoresStatsProps {
  creadores: Creador[]
  calificaciones: CreadorCalificacion[]
}

export function CreadoresStats({ creadores, calificaciones }: CreadoresStatsProps) {
  const total = creadores.length
  const disponibles = creadores.filter(c => c.estado === "Disponible").length
  const conCalificacion = new Set(calificaciones.map(c => c.creadorId)).size

  let promedioGeneral = 0
  if (calificaciones.length > 0) {
    const sum = calificaciones.reduce((s, c) => s + (c.calidadVisual + c.puntualidad + c.creatividad + c.comunicacion + c.seguimientoBrief) / 5, 0)
    promedioGeneral = sum / calificaciones.length
  }

  const stats = [
    { title: "Creadores Registrados", value: String(total), icon: Users, color: "from-[oklch(0.68_0.10_245)] to-[oklch(0.55_0.12_245)]" },
    { title: "Disponibles", value: String(disponibles), icon: UserCheck, color: "from-[oklch(0.72_0.10_155)] to-[oklch(0.52_0.14_165)]" },
    { title: "Calificación Promedio", value: promedioGeneral > 0 ? promedioGeneral.toFixed(1) : "—", icon: Star, color: "from-[oklch(0.76_0.10_70)] to-[oklch(0.74_0.11_55)]" },
    { title: "Evaluados", value: `${conCalificacion}/${total}`, icon: ClipboardCheck, color: "from-[oklch(0.68_0.12_300)] to-[oklch(0.52_0.12_350)]" },
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
