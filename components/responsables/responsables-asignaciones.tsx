"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Briefcase, CheckCircle, Clock } from "lucide-react"
import { getProyectos, getTareas } from "@/lib/store"
import { getUsuarios, rolesLabels } from "@/lib/auth"

type AsignacionData = {
  responsable: string
  rol: string
  proyectos: { nombre: string; progreso: number; estado: string }[]
  cargaTrabajo: number
}

export function ResponsablesAsignaciones() {
  const [asignaciones, setAsignaciones] = useState<AsignacionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getUsuarios(), getProyectos(), getTareas()]).then(([users, proyectos, tareas]) => {
      const data = users.filter(u => u.rol !== "admin").map(u => {
        const misProyectos = proyectos.filter(p => p.responsable === u.nombre).map(p => ({
          nombre: p.nombre,
          progreso: p.progreso,
          estado: p.estado,
        }))
        const misTareasPend = tareas.filter(t => t.asignado === u.nombre && t.estado !== "Completada").length
        const misTareasTotal = tareas.filter(t => t.asignado === u.nombre).length
        const carga = misTareasTotal > 0 ? Math.min(100, Math.round((misTareasPend / Math.max(misTareasTotal, 1)) * 100)) : 0
        return {
          responsable: u.nombre,
          rol: rolesLabels[u.rol] || u.rol,
          proyectos: misProyectos,
          cargaTrabajo: carga,
        }
      }).filter(a => a.proyectos.length > 0)
      setAsignaciones(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="text-center py-8"><div className="animate-pulse text-muted-foreground">Cargando asignaciones...</div></div>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {asignaciones.map((asignacion) => (
        <Card key={asignacion.responsable} className="glass border-white/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold">
                    {asignacion.responsable.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{asignacion.responsable}</CardTitle>
                  <p className="text-sm text-muted-foreground">{asignacion.rol}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Carga de trabajo</div>
                <div className={`text-lg font-bold ${
                  asignacion.cargaTrabajo > 80 ? 'satin-red' : 
                  asignacion.cargaTrabajo > 60 ? 'satin-yellow' : 'satin-green'
                }`}>
                  {asignacion.cargaTrabajo}%
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {asignacion.proyectos.map((proyecto) => (
              <div
                key={proyecto.nombre}
                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{proyecto.nombre}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      proyecto.estado === "Completado"
                        ? "satin-green satin-green-border"
                        : proyecto.estado === "En revisión"
                        ? "text-white/60 border-white/10"
                        : proyecto.estado === "Iniciando"
                        ? "text-white/40 border-gray-500/30"
                        : "satin-yellow satin-yellow-border"
                    }`}
                  >
                    {proyecto.estado === "Completado" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {proyecto.estado === "En progreso" && <Clock className="h-3 w-3 mr-1" />}
                    {proyecto.estado}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={proyecto.progreso} className="h-2 flex-1" />
                  <span className="text-xs font-medium w-10 text-right">{proyecto.progreso}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
