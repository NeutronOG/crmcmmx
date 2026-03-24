"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Trash2, AlertCircle } from "lucide-react"
import { getTareas } from "@/lib/store"
import type { Tarea } from "@/lib/store"

export function ActivityFeed() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTareas().then(data => {
      setTareas(data.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()).slice(0, 8))
      setLoading(false)
    })
  }, [])

  const getStatusIcon = (estado: Tarea["estado"]) => {
    switch (estado) {
      case "Completada":
        return <CheckCircle2 className="h-5 w-5 satin-green" />
      case "En Progreso":
        return <Circle className="h-5 w-5 text-blue-400" />
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (estado: Tarea["estado"]) => {
    switch (estado) {
      case "Completada":
        return <Badge className="bg-green-500/20 text-green-300">Completada</Badge>
      case "En Progreso":
        return <Badge className="bg-blue-500/20 text-blue-300">En Progreso</Badge>
      case "En Revisión":
        return <Badge className="bg-yellow-500/20 text-yellow-300">En Revisión</Badge>
      default:
        return <Badge variant="outline">Pendiente</Badge>
    }
  }

  const getTimeAgo = (date: string | undefined) => {
    if (!date) return "—"
    const now = new Date()
    const then = new Date(date)
    const diff = now.getTime() - then.getTime()
    const mins = Math.floor(diff / 60000)
    
    if (mins < 1) return "Ahora"
    if (mins < 60) return `Hace ${mins}m`
    if (mins < 1440) return `Hace ${Math.floor(mins / 60)}h`
    return `Hace ${Math.floor(mins / 1440)}d`
  }

  if (loading) {
    return (
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Cargando tareas...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (tareas.length === 0) {
    return (
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Sin tareas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            Crea tareas para ver la actividad aquí
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas tareas del equipo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tareas.map(tarea => (
            <div
              key={tarea.id}
              className="flex items-start gap-3 p-4 rounded-lg border bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="pt-1">
                {getStatusIcon(tarea.estado)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-foreground">
                    {tarea.titulo}
                  </p>
                  {getStatusBadge(tarea.estado)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {tarea.proyecto && <span>Proyecto: {tarea.proyecto}</span>}
                  {tarea.asignado && <span> • Asignado a: {tarea.asignado}</span>}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {getTimeAgo(tarea.fechaCreacion)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
