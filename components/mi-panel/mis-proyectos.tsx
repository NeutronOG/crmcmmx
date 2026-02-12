"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Briefcase, Calendar, User } from "lucide-react"
import { getProyectosByUsuario } from "@/lib/store"
import type { Proyecto } from "@/lib/store"
import { useAuth } from "@/components/auth-provider"

export function MisProyectos() {
  const { usuario } = useAuth()
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!usuario) return
    getProyectosByUsuario(usuario.nombre).then((data) => {
      setProyectos(data.filter(p => p.estado !== "Completado"))
      setLoading(false)
    })
  }, [usuario])

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Planificación": return "bg-white/5 text-white/40 border-white/10"
      case "En Progreso": return "satin-blue-bg satin-blue satin-blue-border"
      case "En Revisión": return "satin-yellow-bg satin-yellow satin-yellow-border"
      case "Completado": return "satin-green-bg satin-green satin-green-border"
      case "Pausado": return "satin-red-bg satin-red satin-red-border"
      default: return ""
    }
  }

  const getProgressColor = (progreso: number) => {
    if (progreso >= 75) return "satin-green-bg"
    if (progreso >= 50) return "satin-blue-solid"
    if (progreso >= 25) return "satin-yellow-solid"
    return "satin-slate-bg"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl satin-purple-bg flex items-center justify-center">
          <Briefcase className="size-5 satin-purple" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Mis Proyectos</h2>
          <p className="text-sm text-muted-foreground">{proyectos.length} proyecto{proyectos.length !== 1 ? "s" : ""} activo{proyectos.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-pulse text-muted-foreground">Cargando proyectos...</div>
        </div>
      ) : proyectos.length === 0 ? (
        <Card className="glass-card p-8 rounded-xl text-center">
          <Briefcase className="size-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No tienes proyectos activos</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {proyectos.map((proyecto) => (
            <Card key={proyecto.id} className="glass-card p-4 rounded-xl hover:scale-[1.005] transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{proyecto.nombre}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{proyecto.cliente} &middot; {proyecto.tipo}</p>
                </div>
                <Badge variant="outline" className={`rounded-full text-xs shrink-0 ml-2 ${getEstadoColor(proyecto.estado)}`}>
                  {proyecto.estado}
                </Badge>
              </div>

              {proyecto.descripcion && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{proyecto.descripcion}</p>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="font-medium">{proyecto.progreso}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(proyecto.progreso)}`}
                    style={{ width: `${proyecto.progreso}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                {proyecto.fechaInicio && (
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>{proyecto.fechaInicio}</span>
                  </div>
                )}
                {proyecto.fechaEntrega && (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground/50">→</span>
                    <span>{proyecto.fechaEntrega}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
